import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AikaClawConfig } from "../config/config.js";

const ensureAikaClawModelsJsonMock = vi.fn<
  (config: unknown, agentDir: unknown) => Promise<{ agentDir: string; wrote: boolean }>
>(async () => ({ agentDir: "/tmp/agent", wrote: false }));
const resolveModelAsyncMock = vi.fn<
  (
    provider: unknown,
    modelId: unknown,
    agentDir: unknown,
    cfg: unknown,
    options?: unknown,
  ) => Promise<{ model: { id: string; provider: string; api: string } }>
>(async () => ({
  model: {
    id: "gpt-5.4",
    provider: "openai-codex",
    api: "openai-codex-responses",
  },
}));

vi.mock("../agents/agent-paths.js", () => ({
  resolveAikaClawAgentDir: () => "/tmp/agent",
}));

vi.mock("../agents/models-config.js", () => ({
  ensureAikaClawModelsJson: (config: unknown, agentDir: unknown) =>
    ensureAikaClawModelsJsonMock(config, agentDir),
}));

vi.mock("../agents/pi-embedded-runner/model.js", () => ({
  resolveModelAsync: (
    provider: unknown,
    modelId: unknown,
    agentDir: unknown,
    cfg: unknown,
    options?: unknown,
  ) => resolveModelAsyncMock(provider, modelId, agentDir, cfg, options),
}));

describe("gateway startup primary model warmup", () => {
  beforeEach(() => {
    ensureAikaClawModelsJsonMock.mockClear();
    resolveModelAsyncMock.mockClear();
  });

  it("prewarms an explicit configured primary model", async () => {
    const { __testing } = await import("./server-startup.js");
    const cfg = {
      agents: {
        defaults: {
          model: {
            primary: "openai-codex/gpt-5.4",
          },
        },
      },
    } as AikaClawConfig;

    await __testing.prewarmConfiguredPrimaryModel({
      cfg,
      log: { warn: vi.fn() },
    });

    expect(ensureAikaClawModelsJsonMock).toHaveBeenCalledWith(cfg, "/tmp/agent");
    expect(resolveModelAsyncMock).toHaveBeenCalledWith(
      "openai-codex",
      "gpt-5.4",
      "/tmp/agent",
      cfg,
      {
        retryTransientProviderRuntimeMiss: true,
      },
    );
  });

  it("skips warmup when no explicit primary model is configured", async () => {
    const { __testing } = await import("./server-startup.js");

    await __testing.prewarmConfiguredPrimaryModel({
      cfg: {} as AikaClawConfig,
      log: { warn: vi.fn() },
    });

    expect(ensureAikaClawModelsJsonMock).not.toHaveBeenCalled();
    expect(resolveModelAsyncMock).not.toHaveBeenCalled();
  });
});
