---
summary: "CLI reference for `aikaclaw reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `aikaclaw reset`

Reset local config/state (keeps the CLI installed).

```bash
aikaclaw backup create
aikaclaw reset
aikaclaw reset --dry-run
aikaclaw reset --scope config+creds+sessions --yes --non-interactive
```

Run `aikaclaw backup create` first if you want a restorable snapshot before removing local state.
