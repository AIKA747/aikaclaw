#!/usr/bin/env bash

AIKACLAW_DOCKER_LIVE_AUTH_ALL=(.claude .codex .minimax .qwen)

aikaclaw_live_trim() {
  local value="${1:-}"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

aikaclaw_live_normalize_auth_dir() {
  local value
  value="$(aikaclaw_live_trim "${1:-}")"
  [[ -n "$value" ]] || return 1
  value="${value#.}"
  printf '.%s' "$value"
}

aikaclaw_live_should_include_auth_dir_for_provider() {
  local provider
  provider="$(aikaclaw_live_trim "${1:-}")"
  case "$provider" in
    anthropic)
      printf '%s\n' ".claude"
      ;;
    codex-cli | openai-codex)
      printf '%s\n' ".codex"
      ;;
    minimax | minimax-portal)
      printf '%s\n' ".minimax"
      ;;
    qwen | qwen-portal-auth)
      printf '%s\n' ".qwen"
      ;;
  esac
}

aikaclaw_live_collect_auth_dirs_from_csv() {
  local raw="${1:-}"
  local token normalized
  local -A seen=()
  [[ -n "$(aikaclaw_live_trim "$raw")" ]] || return 0
  IFS=',' read -r -a tokens <<<"$raw"
  for token in "${tokens[@]}"; do
    while IFS= read -r normalized; do
      [[ -n "$normalized" ]] || continue
      if [[ -z "${seen[$normalized]:-}" ]]; then
        printf '%s\n' "$normalized"
        seen[$normalized]=1
      fi
    done < <(aikaclaw_live_should_include_auth_dir_for_provider "$token")
  done
}

aikaclaw_live_collect_auth_dirs_from_override() {
  local raw token normalized
  raw="$(aikaclaw_live_trim "${AIKACLAW_DOCKER_AUTH_DIRS:-}")"
  [[ -n "$raw" ]] || return 1
  case "$raw" in
    all)
      printf '%s\n' "${AIKACLAW_DOCKER_LIVE_AUTH_ALL[@]}"
      return 0
      ;;
    none)
      return 0
      ;;
  esac
  IFS=',' read -r -a tokens <<<"$raw"
  for token in "${tokens[@]}"; do
    normalized="$(aikaclaw_live_normalize_auth_dir "$token")" || continue
    printf '%s\n' "$normalized"
  done | awk '!seen[$0]++'
  return 0
}

aikaclaw_live_collect_auth_dirs() {
  if aikaclaw_live_collect_auth_dirs_from_override; then
    return 0
  fi
  printf '%s\n' "${AIKACLAW_DOCKER_LIVE_AUTH_ALL[@]}"
}

aikaclaw_live_join_csv() {
  local first=1 value
  for value in "$@"; do
    [[ -n "$value" ]] || continue
    if (( first )); then
      printf '%s' "$value"
      first=0
    else
      printf ',%s' "$value"
    fi
  done
}
