# Deploying LingoQuest on a VM

This guide covers deploying the LingoQuest Next.js app to a Linux virtual machine (e.g. Ubuntu 22.04/24.04 on AWS EC2, GCP, Azure, DigitalOcean, or Hetzner). The app is a standard Next.js (App Router) server, so it runs anywhere Node.js runs.

Architecture on the VM:

```
Internet --> Nginx (443/80, TLS) --> Next.js server (127.0.0.1:3000) --> OpenAI API
                                          |
                                    localStorage lives in each user's browser
```

> Note: LingoQuest stores learner progress in the browser's `localStorage`, so there is **no database to provision**. The only server-side secret is `OPENAI_API_KEY`.

---

## 1. Prerequisites

- A VM running a recent Linux (this guide assumes Ubuntu).
- A user with `sudo` access. (nvm installs Node under this user's home directory.)
- A domain name pointed at the VM's public IP (optional but recommended for HTTPS).
- Inbound firewall/security-group rules allowing ports **80** and **443** (and **22** for SSH).
- Your `OPENAI_API_KEY`.

---

## 2. Install system dependencies

SSH into the VM, then install git:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
```

Install Node.js 24 with [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager). Run these as the app user (not root), since nvm installs into the user's home directory:

```bash
# Install nvm (check the repo for the latest version tag)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Load nvm into the current shell (or open a new shell)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 24 and make it the default
nvm install 24
nvm alias default 24
nvm use default

# Verify
node -v   # v24.x
npm -v
```

The `nvm install ... && nvm alias default 24` step ensures new login shells (and the service in step 6) use Node 24 automatically.

---

## 3. Get the code

```bash
# Choose a deploy location
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
cd /var/www

git clone <YOUR_REPO_URL> lingoquest
cd lingoquest
```

If you deploy by copying files instead of git, `rsync` the project (excluding `node_modules` and `.next`) to `/var/www/lingoquest`.

---

## 4. Configure environment

Create `.env.local` with your production secrets. Only the API key is required.

```bash
cat > .env.local <<'EOF'
OPENAI_API_KEY=sk-your-real-key
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-5.4-nano
EOF

chmod 600 .env.local
```

`.env.local` is git-ignored and must never be committed. Keep permissions tight since it holds your key.

---

## 5. Install, build, and smoke-test

```bash
npm ci          # clean, reproducible install from package-lock.json
npm run build    # production build
npm run start    # starts the server on port 3000
```

Visit `http://<VM_IP>:3000` (temporarily open the port, or use an SSH tunnel) to confirm it works, then stop it with `Ctrl+C`.

> `npm ci` requires a committed `package-lock.json`. If you don't have one yet, run `npm install` once locally and commit the lockfile.

---

## 6. Run as a service

Use one of the following to keep the app running and restart it on reboot/crash.

Because Node is installed via nvm under the app user's home directory, the service must run **as that user** and point at the nvm-installed Node. First capture the exact paths:

```bash
whoami                 # the app user, e.g. "deploy" -> used as <APP_USER>
nvm which default      # e.g. /home/deploy/.nvm/versions/node/v24.4.0/bin/node
```

The directory containing that `node` binary (e.g. `/home/deploy/.nvm/versions/node/v24.4.0/bin`) is your `<NODE_BIN_DIR>`. Use both values below.

### Option A: systemd (recommended, no extra dependencies)

Create the unit file, replacing `<APP_USER>` and `<NODE_BIN_DIR>`:

```bash
sudo tee /etc/systemd/system/lingoquest.service > /dev/null <<'EOF'
[Unit]
Description=LingoQuest Next.js app
After=network.target

[Service]
Type=simple
User=<APP_USER>
WorkingDirectory=/var/www/lingoquest
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=PATH=<NODE_BIN_DIR>:/usr/bin:/bin
EnvironmentFile=/var/www/lingoquest/.env.local
ExecStart=<NODE_BIN_DIR>/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

Make sure the app user owns the directory, then enable and start it:

```bash
sudo chown -R <APP_USER>:<APP_USER> /var/www/lingoquest
sudo systemctl daemon-reload
sudo systemctl enable --now lingoquest
sudo systemctl status lingoquest
journalctl -u lingoquest -f   # live logs
```

> Setting `PATH` to the nvm `<NODE_BIN_DIR>` is what lets systemd find the right Node without loading nvm. After a Node upgrade (`nvm install ...`), update `<NODE_BIN_DIR>` in the unit and run `sudo systemctl daemon-reload && sudo systemctl restart lingoquest`.

### Option B: PM2

Install PM2 with the nvm-managed npm (no `sudo` needed — it installs into the nvm Node):

```bash
npm install -g pm2
pm2 start npm --name lingoquest -- run start
pm2 save
pm2 startup   # follow the printed command; it detects the nvm Node path for you
```

---

## 7. Reverse proxy with Nginx

Serve the app on ports 80/443 and proxy to the Node server on 3000.

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/lingoquest > /dev/null <<'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/lingoquest /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## 8. Enable HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot edits the Nginx config for TLS and sets up auto-renewal. Verify renewal with:

```bash
sudo certbot renew --dry-run
```

---

## 9. Firewall

If using UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # opens 80 and 443
sudo ufw enable
sudo ufw status
```

Close port 3000 to the public — only Nginx (localhost) should reach it. Also confirm your cloud provider's security group matches.

---

## 10. Updating to a new version

```bash
cd /var/www/lingoquest
git pull
npm ci
npm run build

# systemd
sudo systemctl restart lingoquest
# or PM2
pm2 restart lingoquest
```

For zero-downtime you can build into a fresh directory and switch a symlink, but a quick restart is fine for this app.

---

## 11. Operations checklist

- **Logs:** `journalctl -u lingoquest -f` (systemd) or `pm2 logs lingoquest`.
- **Health:** the home page (`/`) should return 200; `/api/chat` accepts `POST` only.
- **Fallback behavior:** if `OPENAI_API_KEY` is missing/invalid, chat still responds with a graceful non-AI fallback message (see `lib/llm.ts`). Check logs for `LLM chat failed, using fallback` to catch key/model issues.
- **Secrets:** rotate `OPENAI_API_KEY` by editing `.env.local` and restarting the service.
- **Resource sizing:** a small VM (1 vCPU / 1 GB RAM) is enough for light use; give the build step at least ~1 GB RAM (add swap on tiny instances).

---

## 12. Alternative: Docker

If you prefer containers, add a `Dockerfile` using Next.js standalone output and run it behind the same Nginx setup. This is optional and not required for the VM deployment above.
