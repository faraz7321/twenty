#!/bin/bash
set -euo pipefail
exec > >(tee -a /var/log/twenty-setup.log) 2>&1
if [ -f /opt/twenty/.installed ]; then exit 0; fi
apt-get update
apt-get install -y ca-certificates curl openssl
if ! command -v docker >/dev/null; then curl -fsSL https://get.docker.com | sh; fi
systemctl enable --now docker
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
install -d -m 700 /opt/twenty
cd /opt/twenty
curl -fsSL --retry 3 https://raw.githubusercontent.com/faraz7321/twenty/a9df5c3aad6c4cd4060b0f8bdc1a5f369acaf7b7/packages/twenty-docker/docker-compose.yml -o docker-compose.yml
sed -i 's/"3000:3000"/"127.0.0.1:3000:3000"/; s/image: redis$/image: redis:7-alpine/' docker-compose.yml
IP=$(curl -fsS -H 'Metadata-Flavor: Google' http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)
DOMAIN=crm.bizkith.com
if [ ! -f .env ]; then
  umask 077
  VERSION=$(curl -fsS --retry 3 'https://hub.docker.com/v2/repositories/twentycrm/twenty/tags?page_size=100' | python3 -c 'import sys,json,re; a=[t["name"] for t in json.load(sys.stdin)["results"] if re.fullmatch(r"v[0-9]+\.[0-9]+\.[0-9]+",t["name"])]; print(max(a,key=lambda x:tuple(map(int,x[1:].split(".")))))')
  printf 'TAG=%s\nSERVER_URL=https://%s\nSTORAGE_TYPE=local\nPG_DATABASE_PASSWORD=%s\nENCRYPTION_KEY=%s\n' "$VERSION" "$DOMAIN" "$(openssl rand -hex 24)" "$(openssl rand -base64 32)" > .env
fi
sed -i "s|^SERVER_URL=.*|SERVER_URL=https://$DOMAIN|" .env
cat > Caddyfile <<CADDY
$DOMAIN {
  reverse_proxy server:3000
}
CADDY
cat > compose.proxy.yml <<'PROXY'
services:
  server:
    healthcheck:
      start_period: 10m
  caddy:
    image: caddy:2-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
volumes:
  caddy-data:
  caddy-config:
PROXY
docker compose -f docker-compose.yml -f compose.proxy.yml up -d
touch .installed
