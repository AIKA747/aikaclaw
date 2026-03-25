import type { AikaClawConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: AikaClawConfig, pluginId: string): AikaClawConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
