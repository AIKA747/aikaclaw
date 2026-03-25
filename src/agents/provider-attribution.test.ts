import { describe, expect, it } from "vitest";
import {
  listProviderAttributionPolicies,
  resolveProviderAttributionHeaders,
  resolveProviderAttributionIdentity,
  resolveProviderAttributionPolicy,
} from "./provider-attribution.js";

describe("provider attribution", () => {
  it("resolves the canonical AikaClaw product and runtime version", () => {
    const identity = resolveProviderAttributionIdentity({
      AIKACLAW_VERSION: "2026.3.99",
    });

    expect(identity).toEqual({
      product: "AikaClaw",
      version: "2026.3.99",
    });
  });

  it("returns a documented OpenRouter attribution policy", () => {
    const policy = resolveProviderAttributionPolicy("openrouter", {
      AIKACLAW_VERSION: "2026.3.22",
    });

    expect(policy).toEqual({
      provider: "openrouter",
      enabledByDefault: true,
      verification: "vendor-documented",
      hook: "request-headers",
      docsUrl: "https://openrouter.ai/docs/app-attribution",
      reviewNote: "Documented app attribution headers. Verified in AikaClaw runtime wrapper.",
      product: "AikaClaw",
      version: "2026.3.22",
      headers: {
        "HTTP-Referer": "https://aikaclaw.ai",
        "X-OpenRouter-Title": "AikaClaw",
        "X-OpenRouter-Categories": "cli-agent",
      },
    });
  });

  it("normalizes aliases when resolving provider headers", () => {
    expect(
      resolveProviderAttributionHeaders("OpenRouter", {
        AIKACLAW_VERSION: "2026.3.22",
      }),
    ).toEqual({
      "HTTP-Referer": "https://aikaclaw.ai",
      "X-OpenRouter-Title": "AikaClaw",
      "X-OpenRouter-Categories": "cli-agent",
    });
  });

  it("returns a hidden-spec OpenAI attribution policy", () => {
    expect(resolveProviderAttributionPolicy("openai", { AIKACLAW_VERSION: "2026.3.22" })).toEqual({
      provider: "openai",
      enabledByDefault: true,
      verification: "vendor-hidden-api-spec",
      hook: "request-headers",
      reviewNote:
        "OpenAI native traffic supports hidden originator/User-Agent attribution. Verified against the Codex wire contract.",
      product: "AikaClaw",
      version: "2026.3.22",
      headers: {
        originator: "aikaclaw",
        "User-Agent": "aikaclaw/2026.3.22",
      },
    });
    expect(resolveProviderAttributionHeaders("openai", { AIKACLAW_VERSION: "2026.3.22" })).toEqual({
      originator: "aikaclaw",
      "User-Agent": "aikaclaw/2026.3.22",
    });
  });

  it("returns a hidden-spec OpenAI Codex attribution policy", () => {
    expect(
      resolveProviderAttributionPolicy("openai-codex", { AIKACLAW_VERSION: "2026.3.22" }),
    ).toEqual({
      provider: "openai-codex",
      enabledByDefault: true,
      verification: "vendor-hidden-api-spec",
      hook: "request-headers",
      reviewNote:
        "OpenAI Codex ChatGPT-backed traffic supports the same hidden originator/User-Agent attribution contract.",
      product: "AikaClaw",
      version: "2026.3.22",
      headers: {
        originator: "aikaclaw",
        "User-Agent": "aikaclaw/2026.3.22",
      },
    });
  });

  it("lists the current attribution support matrix", () => {
    expect(
      listProviderAttributionPolicies({ AIKACLAW_VERSION: "2026.3.22" }).map((policy) => [
        policy.provider,
        policy.enabledByDefault,
        policy.verification,
        policy.hook,
      ]),
    ).toEqual([
      ["openrouter", true, "vendor-documented", "request-headers"],
      ["openai", true, "vendor-hidden-api-spec", "request-headers"],
      ["openai-codex", true, "vendor-hidden-api-spec", "request-headers"],
      ["anthropic", false, "vendor-sdk-hook-only", "default-headers"],
      ["google", false, "vendor-sdk-hook-only", "user-agent-extra"],
      ["groq", false, "vendor-sdk-hook-only", "default-headers"],
      ["mistral", false, "vendor-sdk-hook-only", "custom-user-agent"],
      ["together", false, "vendor-sdk-hook-only", "default-headers"],
    ]);
  });
});
