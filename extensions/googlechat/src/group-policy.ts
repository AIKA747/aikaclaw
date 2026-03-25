import { resolveChannelGroupRequireMention } from "aikaclaw/plugin-sdk/channel-policy";
import type { AikaClawConfig } from "aikaclaw/plugin-sdk/core";

type GoogleChatGroupContext = {
  cfg: AikaClawConfig;
  accountId?: string | null;
  groupId?: string | null;
};

export function resolveGoogleChatGroupRequireMention(params: GoogleChatGroupContext): boolean {
  return resolveChannelGroupRequireMention({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
