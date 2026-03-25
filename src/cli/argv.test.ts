import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getCommandPositionalsWithRootOptions,
  getCommandPathWithRootOptions,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  isRootHelpInvocation,
  isRootVersionInvocation,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "aikaclaw", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "aikaclaw", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "aikaclaw", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "aikaclaw", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "aikaclaw", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "aikaclaw", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "aikaclaw", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "aikaclaw", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "aikaclaw", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --version",
      argv: ["node", "aikaclaw", "--version"],
      expected: true,
    },
    {
      name: "root -V",
      argv: ["node", "aikaclaw", "-V"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "aikaclaw", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "subcommand version flag",
      argv: ["node", "aikaclaw", "status", "--version"],
      expected: false,
    },
    {
      name: "unknown root flag with version",
      argv: ["node", "aikaclaw", "--unknown", "--version"],
      expected: false,
    },
  ])("detects root-only version invocations: $name", ({ argv, expected }) => {
    expect(isRootVersionInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --help",
      argv: ["node", "aikaclaw", "--help"],
      expected: true,
    },
    {
      name: "root -h",
      argv: ["node", "aikaclaw", "-h"],
      expected: true,
    },
    {
      name: "root --help with profile",
      argv: ["node", "aikaclaw", "--profile", "work", "--help"],
      expected: true,
    },
    {
      name: "subcommand --help",
      argv: ["node", "aikaclaw", "status", "--help"],
      expected: false,
    },
    {
      name: "help before subcommand token",
      argv: ["node", "aikaclaw", "--help", "status"],
      expected: false,
    },
    {
      name: "help after -- terminator",
      argv: ["node", "aikaclaw", "nodes", "run", "--", "git", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag before help",
      argv: ["node", "aikaclaw", "--unknown", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag after help",
      argv: ["node", "aikaclaw", "--help", "--unknown"],
      expected: false,
    },
  ])("detects root-only help invocations: $name", ({ argv, expected }) => {
    expect(isRootHelpInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "aikaclaw", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "aikaclaw", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "aikaclaw", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it("extracts command path while skipping known root option values", () => {
    expect(
      getCommandPathWithRootOptions(
        [
          "node",
          "aikaclaw",
          "--profile",
          "work",
          "--container",
          "demo",
          "--no-color",
          "config",
          "validate",
        ],
        2,
      ),
    ).toEqual(["config", "validate"]);
  });

  it("extracts routed config get positionals with interleaved root options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "aikaclaw", "config", "get", "--log-level", "debug", "update.channel", "--json"],
        {
          commandPath: ["config", "get"],
          booleanFlags: ["--json"],
        },
      ),
    ).toEqual(["update.channel"]);
  });

  it("extracts routed config unset positionals with interleaved root options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "aikaclaw", "config", "unset", "--profile", "work", "update.channel"],
        {
          commandPath: ["config", "unset"],
        },
      ),
    ).toEqual(["update.channel"]);
  });

  it("returns null when routed command sees unknown options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "aikaclaw", "config", "get", "--mystery", "value", "update.channel"],
        {
          commandPath: ["config", "get"],
          booleanFlags: ["--json"],
        },
      ),
    ).toBeNull();
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "aikaclaw", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "aikaclaw"],
      expected: null,
    },
    {
      name: "skips known root option values",
      argv: ["node", "aikaclaw", "--log-level", "debug", "status"],
      expected: "status",
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "aikaclaw", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "aikaclaw", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "aikaclaw", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "aikaclaw", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "aikaclaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "aikaclaw", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "aikaclaw", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "aikaclaw", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "aikaclaw", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "aikaclaw", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "aikaclaw", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "aikaclaw", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "aikaclaw", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "aikaclaw", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "aikaclaw", "status"],
        expected: ["node", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node-22", "aikaclaw", "status"],
        expected: ["node-22", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "aikaclaw", "status"],
        expected: ["node-22.2.0.exe", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node-22.2", "aikaclaw", "status"],
        expected: ["node-22.2", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "aikaclaw", "status"],
        expected: ["node-22.2.exe", "aikaclaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "aikaclaw", "status"],
        expected: ["/usr/bin/node-22.2.0", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node24", "aikaclaw", "status"],
        expected: ["node24", "aikaclaw", "status"],
      },
      {
        rawArgs: ["/usr/bin/node24", "aikaclaw", "status"],
        expected: ["/usr/bin/node24", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node24.exe", "aikaclaw", "status"],
        expected: ["node24.exe", "aikaclaw", "status"],
      },
      {
        rawArgs: ["nodejs", "aikaclaw", "status"],
        expected: ["nodejs", "aikaclaw", "status"],
      },
      {
        rawArgs: ["node-dev", "aikaclaw", "status"],
        expected: ["node", "aikaclaw", "node-dev", "aikaclaw", "status"],
      },
      {
        rawArgs: ["aikaclaw", "status"],
        expected: ["node", "aikaclaw", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "aikaclaw",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "aikaclaw",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "aikaclaw", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "aikaclaw", "status"],
      ["node", "aikaclaw", "health"],
      ["node", "aikaclaw", "sessions"],
      ["node", "aikaclaw", "config", "get", "update"],
      ["node", "aikaclaw", "config", "unset", "update"],
      ["node", "aikaclaw", "models", "list"],
      ["node", "aikaclaw", "models", "status"],
      ["node", "aikaclaw", "memory", "status"],
      ["node", "aikaclaw", "update", "status", "--json"],
      ["node", "aikaclaw", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "aikaclaw", "agents", "list"],
      ["node", "aikaclaw", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["update", "status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
