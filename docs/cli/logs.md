---
summary: "CLI reference for `aikaclaw logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `aikaclaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
aikaclaw logs
aikaclaw logs --follow
aikaclaw logs --json
aikaclaw logs --limit 500
aikaclaw logs --local-time
aikaclaw logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
