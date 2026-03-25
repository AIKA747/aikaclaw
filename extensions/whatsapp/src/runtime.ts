import type { PluginRuntime } from "aikaclaw/plugin-sdk/core";
import { createPluginRuntimeStore } from "aikaclaw/plugin-sdk/runtime-store";

const { setRuntime: setWhatsAppRuntime, getRuntime: getWhatsAppRuntime } =
  createPluginRuntimeStore<PluginRuntime>("WhatsApp runtime not initialized");
export { getWhatsAppRuntime, setWhatsAppRuntime };
