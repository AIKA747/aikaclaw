// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export { definePluginEntry } from "./plugin-entry.js";
export type { AikaClawConfig } from "../config/config.js";
export { resolvePreferredAikaClawTmpDir } from "../infra/tmp-aikaclaw-dir.ts";
export type {
  AnyAgentTool,
  AikaClawPluginApi,
  AikaClawPluginConfigSchema,
  AikaClawPluginToolContext,
  PluginLogger,
} from "../plugins/types.js";
