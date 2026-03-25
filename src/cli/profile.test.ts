import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "aikaclaw",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "aikaclaw", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("leaves gateway --dev for subcommands after leading root options", () => {
    const res = parseCliProfileArgs([
      "node",
      "aikaclaw",
      "--no-color",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual([
      "node",
      "aikaclaw",
      "--no-color",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "aikaclaw", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "aikaclaw", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "aikaclaw", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "aikaclaw", "status"]);
  });

  it("parses interleaved --profile after the command token", () => {
    const res = parseCliProfileArgs(["node", "aikaclaw", "status", "--profile", "work", "--deep"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "aikaclaw", "status", "--deep"]);
  });

  it("parses interleaved --dev after the command token", () => {
    const res = parseCliProfileArgs(["node", "aikaclaw", "status", "--dev"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "aikaclaw", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "aikaclaw", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "aikaclaw", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "aikaclaw", "--profile", "work", "--dev", "status"]],
    ["interleaved after command", ["node", "aikaclaw", "status", "--profile", "work", "--dev"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".aikaclaw-dev");
    expect(env.AIKACLAW_PROFILE).toBe("dev");
    expect(env.AIKACLAW_STATE_DIR).toBe(expectedStateDir);
    expect(env.AIKACLAW_CONFIG_PATH).toBe(path.join(expectedStateDir, "aikaclaw.json"));
    expect(env.AIKACLAW_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      AIKACLAW_STATE_DIR: "/custom",
      AIKACLAW_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.AIKACLAW_STATE_DIR).toBe("/custom");
    expect(env.AIKACLAW_GATEWAY_PORT).toBe("19099");
    expect(env.AIKACLAW_CONFIG_PATH).toBe(path.join("/custom", "aikaclaw.json"));
  });

  it("uses AIKACLAW_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      AIKACLAW_HOME: "/srv/aikaclaw-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/aikaclaw-home");
    expect(env.AIKACLAW_STATE_DIR).toBe(path.join(resolvedHome, ".aikaclaw-work"));
    expect(env.AIKACLAW_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".aikaclaw-work", "aikaclaw.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "aikaclaw doctor --fix",
      env: {},
      expected: "aikaclaw doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "aikaclaw doctor --fix",
      env: { AIKACLAW_PROFILE: "default" },
      expected: "aikaclaw doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "aikaclaw doctor --fix",
      env: { AIKACLAW_PROFILE: "Default" },
      expected: "aikaclaw doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "aikaclaw doctor --fix",
      env: { AIKACLAW_PROFILE: "bad profile" },
      expected: "aikaclaw doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "aikaclaw --profile work doctor --fix",
      env: { AIKACLAW_PROFILE: "work" },
      expected: "aikaclaw --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "aikaclaw --dev doctor",
      env: { AIKACLAW_PROFILE: "dev" },
      expected: "aikaclaw --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("aikaclaw doctor --fix", { AIKACLAW_PROFILE: "work" })).toBe(
      "aikaclaw --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("aikaclaw doctor --fix", { AIKACLAW_PROFILE: "  jbaikaclaw  " })).toBe(
      "aikaclaw --profile jbaikaclaw doctor --fix",
    );
  });

  it("handles command with no args after aikaclaw", () => {
    expect(formatCliCommand("aikaclaw", { AIKACLAW_PROFILE: "test" })).toBe(
      "aikaclaw --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm aikaclaw doctor", { AIKACLAW_PROFILE: "work" })).toBe(
      "pnpm aikaclaw --profile work doctor",
    );
  });

  it("inserts --container when a container hint is set", () => {
    expect(
      formatCliCommand("aikaclaw gateway status --deep", { AIKACLAW_CONTAINER_HINT: "demo" }),
    ).toBe("aikaclaw --container demo gateway status --deep");
  });

  it("preserves both --container and --profile hints", () => {
    expect(
      formatCliCommand("aikaclaw doctor", {
        AIKACLAW_CONTAINER_HINT: "demo",
        AIKACLAW_PROFILE: "work",
      }),
    ).toBe("aikaclaw --container demo doctor");
  });

  it("does not prepend --container for update commands", () => {
    expect(formatCliCommand("aikaclaw update", { AIKACLAW_CONTAINER_HINT: "demo" })).toBe(
      "aikaclaw update",
    );
    expect(
      formatCliCommand("pnpm aikaclaw update --channel beta", { AIKACLAW_CONTAINER_HINT: "demo" }),
    ).toBe("pnpm aikaclaw update --channel beta");
  });
});
