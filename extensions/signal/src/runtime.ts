import type { PluginRuntime } from "aikaclaw/plugin-sdk/core";
import { createPluginRuntimeStore } from "aikaclaw/plugin-sdk/runtime-store";

const { setRuntime: setSignalRuntime, getRuntime: getSignalRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Signal runtime not initialized");
export { getSignalRuntime, setSignalRuntime };
