#!/usr/bin/env bash
set -euo pipefail

cd /repo

export AIKACLAW_STATE_DIR="/tmp/aikaclaw-test"
export AIKACLAW_CONFIG_PATH="${AIKACLAW_STATE_DIR}/aikaclaw.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${AIKACLAW_STATE_DIR}/credentials"
mkdir -p "${AIKACLAW_STATE_DIR}/agents/main/sessions"
echo '{}' >"${AIKACLAW_CONFIG_PATH}"
echo 'creds' >"${AIKACLAW_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${AIKACLAW_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm aikaclaw reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${AIKACLAW_CONFIG_PATH}"
test ! -d "${AIKACLAW_STATE_DIR}/credentials"
test ! -d "${AIKACLAW_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${AIKACLAW_STATE_DIR}/credentials"
echo '{}' >"${AIKACLAW_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm aikaclaw uninstall --state --yes --non-interactive

test ! -d "${AIKACLAW_STATE_DIR}"

echo "OK"
