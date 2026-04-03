import type { Command } from "commander";
import { addGatewayServiceCommands } from "./register-service-commands.js";

export function registerDaemonCli(program: Command) {
  const daemon = program
    .command("daemon")
    .description("Manage the Gateway service (launchd/systemd/schtasks)");

  addGatewayServiceCommands(daemon, {
    statusDescription: "Show service install status + probe the Gateway",
  });
}
