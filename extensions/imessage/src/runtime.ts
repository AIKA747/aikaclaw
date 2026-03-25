import type { PluginRuntime } from "aikaclaw/plugin-sdk/core";
import { createPluginRuntimeStore } from "aikaclaw/plugin-sdk/runtime-store";

const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } =
  createPluginRuntimeStore<PluginRuntime>("iMessage runtime not initialized");
export { getIMessageRuntime, setIMessageRuntime };
