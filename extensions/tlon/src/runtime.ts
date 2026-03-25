import type { PluginRuntime } from "aikaclaw/plugin-sdk/plugin-runtime";
import { createPluginRuntimeStore } from "aikaclaw/plugin-sdk/runtime-store";

const { setRuntime: setTlonRuntime, getRuntime: getTlonRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Tlon runtime not initialized");
export { getTlonRuntime, setTlonRuntime };
