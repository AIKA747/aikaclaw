import { KILOCODE_BASE_URL, KILOCODE_DEFAULT_MODEL_REF } from "aikaclaw/plugin-sdk/provider-models";
import {
  createModelCatalogPresetAppliers,
  type AikaClawConfig,
} from "aikaclaw/plugin-sdk/provider-onboard";
import { buildKilocodeProvider } from "./provider-catalog.js";

export { KILOCODE_BASE_URL, KILOCODE_DEFAULT_MODEL_REF };

const kilocodePresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: KILOCODE_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: AikaClawConfig) => ({
    providerId: "kilocode",
    api: "openai-completions",
    baseUrl: KILOCODE_BASE_URL,
    catalogModels: buildKilocodeProvider().models ?? [],
    aliases: [{ modelRef: KILOCODE_DEFAULT_MODEL_REF, alias: "Kilo Gateway" }],
  }),
});

export function applyKilocodeProviderConfig(cfg: AikaClawConfig): AikaClawConfig {
  return kilocodePresetAppliers.applyProviderConfig(cfg);
}

export function applyKilocodeConfig(cfg: AikaClawConfig): AikaClawConfig {
  return kilocodePresetAppliers.applyConfig(cfg);
}
