# Deploying LingoQuest

Deploy the Next.js app on any Linux VM with Node.js 20+. No database — progress lives in the browser's `localStorage`; the only server secret is your LLM API key ([`.env.example`](../.env.example), via [resilient-llm](https://www.npmjs.com/package/resilient-llm)).

```
Internet → Nginx (443) → Next.js (:3000) → LLM provider
```

## 1. VM setup

- Ubuntu (or similar), `sudo` access, ports **22**, **80**, **443** open
- Domain pointed at the VM (for HTTPS)
- LLM key in `.env.local` (OpenAI default, or OpenRouter `openrouter/free` — see `.env.example`)

```bash
sudo apt update && sudo apt install -y git nginx

# Node via nvm (as app user, not root)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24 && nvm alias default 24
```

## 2. Deploy the app

```bash
sudo mkdir -p /var/www && sudo chown "$USER":"$USER" /var/www
cd /var/www
git clone <YOUR_REPO_URL> lingoquest && cd lingoquest

cp .env.example .env.local   # add your API key
chmod 600 .env.local

npm ci && npm run build
```

Smoke-test: `npm run start` → visit `http://<VM_IP>:3000`, then `Ctrl+C`.

## 3. Run with systemd

```bash
NODE_BIN=$(dirname "$(nvm which default)")

sudo tee /etc/systemd/system/lingoquest.service > /dev/null <<EOF
[Unit]
Description=LingoQuest
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/www/lingoquest
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=PATH=$NODE_BIN:/usr/bin:/bin
EnvironmentFile=/var/www/lingoquest/.env.local
ExecStart=$NODE_BIN/npm run start
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now lingoquest
```

## 4. Nginx + HTTPS

```bash
sudo tee /etc/nginx/sites-available/lingoquest > /dev/null <<'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/lingoquest /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Keep port 3000 closed to the public — only Nginx should reach it.

## 5. Updates & ops

```bash
cd /var/www/lingoquest
git pull && npm ci && npm run build
sudo systemctl restart lingoquest
```

- **Logs:** `journalctl -u lingoquest -f`
- **Health:** `/` returns 200; chat uses `POST /api/chat`
- **Fallback:** missing/invalid LLM key → non-AI fallback reply; check logs for `LLM chat failed, using fallback`
- **Sizing:** 1 vCPU / 1 GB RAM is fine for light use (add swap if the build runs out of memory)
