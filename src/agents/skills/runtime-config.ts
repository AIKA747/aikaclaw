import { getRuntimeConfigSnapshot, type AikaClawConfig } from "../../config/config.js";

export function resolveSkillRuntimeConfig(config?: AikaClawConfig): AikaClawConfig | undefined {
  return getRuntimeConfigSnapshot() ?? config;
}
