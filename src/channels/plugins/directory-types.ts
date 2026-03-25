import type { AikaClawConfig } from "../../config/types.js";

export type DirectoryConfigParams = {
  cfg: AikaClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
