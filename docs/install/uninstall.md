---
summary: "Uninstall AikaClaw completely (CLI, service, state, workspace)"
read_when:
  - You want to remove AikaClaw from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `aikaclaw` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
aikaclaw uninstall
```

Non-interactive (automation / npx):

```bash
aikaclaw uninstall --all --yes --non-interactive
npx -y aikaclaw uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
aikaclaw gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
aikaclaw gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${AIKACLAW_STATE_DIR:-$HOME/.aikaclaw}"
```

If you set `AIKACLAW_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.aikaclaw/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g aikaclaw
pnpm remove -g aikaclaw
bun remove -g aikaclaw
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/AikaClaw.app
```

Notes:

- If you used profiles (`--profile` / `AIKACLAW_PROFILE`), repeat step 3 for each state dir (defaults are `~/.aikaclaw-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `aikaclaw` is missing.

### macOS (launchd)

Default label is `ai.aikaclaw.gateway` (or `ai.aikaclaw.<profile>`; legacy `com.aikaclaw.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.aikaclaw.gateway
rm -f ~/Library/LaunchAgents/ai.aikaclaw.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.aikaclaw.<profile>`. Remove any legacy `com.aikaclaw.*` plists if present.

### Linux (systemd user unit)

Default unit name is `aikaclaw-gateway.service` (or `aikaclaw-gateway-<profile>.service`):

```bash
systemctl --user disable --now aikaclaw-gateway.service
rm -f ~/.config/systemd/user/aikaclaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `AikaClaw Gateway` (or `AikaClaw Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "AikaClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.aikaclaw\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.aikaclaw-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://aikaclaw.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g aikaclaw@latest`.
Remove it with `npm rm -g aikaclaw` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `aikaclaw ...` / `bun run aikaclaw ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
