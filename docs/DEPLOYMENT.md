# Deploying LINGOCRAFT

Deploy the Next.js app on any Linux VM with Node.js 20+. No database — progress lives in the browser's `localStorage`; the only server secret is your LLM API key ([`.env.example`](../.env.example), via [resilient-llm](https://www.npmjs.com/package/resilient-llm)).

The app can run at the site root (`/`) or under a subpath (e.g. `/language`). Set `NEXT_PUBLIC_BASE_PATH` in `.env` before `npm run build` so Next.js routing and client `fetch()` calls share the same prefix (see [`.env.example`](../.env.example)). If unset, `next.config.ts` defaults to `/language`.

```
Internet → Nginx (443) → Next.js (:3003) → LLM provider
```

## 1. VM setup

- Ubuntu (or similar), `sudo` access, ports **22**, **80**, **443** open
- Domain pointed at the VM (for HTTPS)
- LLM key in `.env` (OpenAI default, or OpenRouter `openrouter/free` — see `.env.example`)
- Optional `NEXT_PUBLIC_BASE_PATH` in `.env` if the app is not served at `/` (must match the nginx `location` prefix; rebuild after changing)

```bash
sudo apt update && sudo apt install -y git nginx

# Node via nvm (as app user, not root)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24 && nvm alias default 24
```

## 2. Deploy the app

```bash
git clone https://github.com/AINativeSchool/demo-language-game /home/exedev/demo-language-game
cd /home/exedev/demo-language-game

cp .env.example .env   # add your API key; set NEXT_PUBLIC_BASE_PATH if needed
chmod 600 .env

npm ci && npm run build
```

Smoke-test: `PORT=3003 npm run start` → visit `http://<VM_IP>:3003/language` (or `http://<VM_IP>:3003` when `NEXT_PUBLIC_BASE_PATH` is empty), then `Ctrl+C`.

## 3. Run with systemd

A ready-made unit ships in [`deploy/lingocraft.service`](../deploy/lingocraft.service). It runs as `exedev` on port **3003** and loads secrets from `.env` via `EnvironmentFile`.

```bash
cd /home/exedev/demo-language-game

# Edit User, WorkingDirectory, PORT, or ExecStart if your layout differs (e.g. npm via nvm)
sudo cp deploy/lingocraft.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable --now lingocraft
```

Check status: `systemctl status lingocraft`

## 4. Nginx + HTTPS

Proxy the same path prefix as `NEXT_PUBLIC_BASE_PATH` (example below uses `/language`). No separate `location /api/` shim is needed — the app calls `{basePath}/api/chat` directly.

```bash
sudo tee /etc/nginx/sites-available/lingocraft > /dev/null <<'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location /language/ {
        proxy_pass http://127.0.0.1:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/lingocraft /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Keep port 3003 closed to the public — only Nginx should reach it.

## 5. Updates & ops

```bash
cd /home/exedev/demo-language-game
git pull && npm ci && npm run build
sudo systemctl restart lingocraft
```

- **Logs:** `journalctl -u lingocraft -f`
- **Health:** `{basePath}/` returns 200 (e.g. `/language/`); chat uses `POST {basePath}/api/chat` (e.g. `/language/api/chat`)
- **Fallback:** missing/invalid LLM key → non-AI fallback reply; check logs for `LLM chat failed, using fallback`
- **Sizing:** 1 vCPU / 1 GB RAM is fine for light use (add swap if the build runs out of memory)
