import type { Command } from "commander";
import { docsSearchCommand } from "../commands/docs.js";
import { defaultRuntime } from "../runtime.js";
import { runCommandWithRuntime } from "./cli-utils.js";

export function registerDocsCli(program: Command) {
  program
    .command("docs")
    .description("Search the live AikaClaw docs")
    .argument("[query...]", "Search query")
    .action(async (queryParts: string[]) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await docsSearchCommand(queryParts, defaultRuntime);
      });
    });
}
