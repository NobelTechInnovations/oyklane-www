# Website on AWS Lightsail (Docker)

Runs on the API's server (`ubuntu@13.200.105.217`) in `~/apps/oyklane-www`, behind the shared Caddy in `~/apps/proxy`
(server layout: `oyklane-api/deploy/aws.md`). Set up with `oyklane-api/deploy/frontends-setup.sh`.

- **Address:** oyklane.com, www.oyklane.com.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml` → `~/apps/bin/deploy-oyklane-www.sh` (pull, rebuild, restart).
  By hand: `~/apps/bin/deploy-oyklane-www.sh`.
- **Settings:** addresses are build arguments in `deploy/docker-compose.prod.yml` (edit and push).
  Shared secrets live in `~/apps/oyklane-www/.env` on the server, copied from the API's `.env` by the setup script.
- **HTTPS:** `~/apps/proxy/sites/oyklane-www.caddy` (copy of `deploy/oyklane-www.caddy`).

## Useful
```bash
cd ~/apps/oyklane-www
docker compose -f deploy/docker-compose.prod.yml ps
docker compose -f deploy/docker-compose.prod.yml logs --since 1h web
```
