import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#aikaclaw",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#aikaclaw",
      rawTarget: "#aikaclaw",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "aikaclaw-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "aikaclaw-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "aikaclaw-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "aikaclaw-bot",
      rawTarget: "aikaclaw-bot",
    });
  });
});
