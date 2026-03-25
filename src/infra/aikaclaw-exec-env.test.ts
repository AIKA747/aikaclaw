import { describe, expect, it } from "vitest";
import {
  ensureAikaClawExecMarkerOnProcess,
  markAikaClawExecEnv,
  AIKACLAW_CLI_ENV_VALUE,
  AIKACLAW_CLI_ENV_VAR,
} from "./aikaclaw-exec-env.js";

describe("markAikaClawExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", AIKACLAW_CLI: "0" };
    const marked = markAikaClawExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      AIKACLAW_CLI: AIKACLAW_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.AIKACLAW_CLI).toBe("0");
  });
});

describe("ensureAikaClawExecMarkerOnProcess", () => {
  it("mutates and returns the provided process env", () => {
    const env: NodeJS.ProcessEnv = { PATH: "/usr/bin" };

    expect(ensureAikaClawExecMarkerOnProcess(env)).toBe(env);
    expect(env[AIKACLAW_CLI_ENV_VAR]).toBe(AIKACLAW_CLI_ENV_VALUE);
  });

  it("defaults to mutating process.env when no env object is provided", () => {
    const previous = process.env[AIKACLAW_CLI_ENV_VAR];
    delete process.env[AIKACLAW_CLI_ENV_VAR];

    try {
      expect(ensureAikaClawExecMarkerOnProcess()).toBe(process.env);
      expect(process.env[AIKACLAW_CLI_ENV_VAR]).toBe(AIKACLAW_CLI_ENV_VALUE);
    } finally {
      if (previous === undefined) {
        delete process.env[AIKACLAW_CLI_ENV_VAR];
      } else {
        process.env[AIKACLAW_CLI_ENV_VAR] = previous;
      }
    }
  });
});
