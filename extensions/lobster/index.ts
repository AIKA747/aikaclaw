import { definePluginEntry } from "aikaclaw/plugin-sdk/plugin-entry";
import type { AnyAgentTool, AikaClawPluginApi, AikaClawPluginToolFactory } from "./runtime-api.js";
import { createLobsterTool } from "./src/lobster-tool.js";

export default definePluginEntry({
  id: "lobster",
  name: "Lobster",
  description: "Optional local shell helper tools",
  register(api: AikaClawPluginApi) {
    api.registerTool(
      ((ctx) => {
        if (ctx.sandboxed) {
          return null;
        }
        return createLobsterTool(api) as AnyAgentTool;
      }) as AikaClawPluginToolFactory,
      { optional: true },
    );
  },
});
