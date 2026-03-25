import type { PluginRuntime } from "aikaclaw/plugin-sdk/core";
import { createPluginRuntimeStore } from "aikaclaw/plugin-sdk/runtime-store";

const { setRuntime: setSlackRuntime, getRuntime: getSlackRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Slack runtime not initialized");
export { getSlackRuntime, setSlackRuntime };
