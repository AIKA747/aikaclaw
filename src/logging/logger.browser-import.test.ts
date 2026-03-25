import { afterEach, describe, expect, it, vi } from "vitest";

type LoggerModule = typeof import("./logger.js");

const originalGetBuiltinModule = (
  process as NodeJS.Process & { getBuiltinModule?: (id: string) => unknown }
).getBuiltinModule;

async function importBrowserSafeLogger(params?: {
  resolvePreferredAikaClawTmpDir?: ReturnType<typeof vi.fn>;
}): Promise<{
  module: LoggerModule;
  resolvePreferredAikaClawTmpDir: ReturnType<typeof vi.fn>;
}> {
  vi.resetModules();
  const resolvePreferredAikaClawTmpDir =
    params?.resolvePreferredAikaClawTmpDir ??
    vi.fn(() => {
      throw new Error("resolvePreferredAikaClawTmpDir should not run during browser-safe import");
    });

  vi.doMock("../infra/tmp-aikaclaw-dir.js", async () => {
    const actual = await vi.importActual<typeof import("../infra/tmp-aikaclaw-dir.js")>(
      "../infra/tmp-aikaclaw-dir.js",
    );
    return {
      ...actual,
      resolvePreferredAikaClawTmpDir,
    };
  });

  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: undefined,
  });

  const module = await import("./logger.js");
  return { module, resolvePreferredAikaClawTmpDir };
}

describe("logging/logger browser-safe import", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("../infra/tmp-aikaclaw-dir.js");
    Object.defineProperty(process, "getBuiltinModule", {
      configurable: true,
      value: originalGetBuiltinModule,
    });
  });

  it("does not resolve the preferred temp dir at import time when node fs is unavailable", async () => {
    const { module, resolvePreferredAikaClawTmpDir } = await importBrowserSafeLogger();

    expect(resolvePreferredAikaClawTmpDir).not.toHaveBeenCalled();
    expect(module.DEFAULT_LOG_DIR).toBe("/tmp/aikaclaw");
    expect(module.DEFAULT_LOG_FILE).toBe("/tmp/aikaclaw/aikaclaw.log");
  });

  it("disables file logging when imported in a browser-like environment", async () => {
    const { module, resolvePreferredAikaClawTmpDir } = await importBrowserSafeLogger();

    expect(module.getResolvedLoggerSettings()).toMatchObject({
      level: "silent",
      file: "/tmp/aikaclaw/aikaclaw.log",
    });
    expect(module.isFileLogLevelEnabled("info")).toBe(false);
    expect(() => module.getLogger().info("browser-safe")).not.toThrow();
    expect(resolvePreferredAikaClawTmpDir).not.toHaveBeenCalled();
  });
});
