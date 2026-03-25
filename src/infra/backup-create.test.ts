import { describe, expect, it } from "vitest";
import { formatBackupCreateSummary, type BackupCreateResult } from "./backup-create.js";

function makeResult(overrides: Partial<BackupCreateResult> = {}): BackupCreateResult {
  return {
    createdAt: "2026-01-01T00:00:00.000Z",
    archiveRoot: "aikaclaw-backup-2026-01-01",
    archivePath: "/tmp/aikaclaw-backup.tar.gz",
    dryRun: false,
    includeWorkspace: true,
    onlyConfig: false,
    verified: false,
    assets: [],
    skipped: [],
    ...overrides,
  };
}

describe("formatBackupCreateSummary", () => {
  it("formats created archives with included and skipped paths", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        verified: true,
        assets: [
          {
            kind: "state",
            sourcePath: "/state",
            archivePath: "archive/state",
            displayPath: "~/.aikaclaw",
          },
        ],
        skipped: [
          {
            kind: "workspace",
            sourcePath: "/workspace",
            displayPath: "~/Projects/aikaclaw",
            reason: "covered",
            coveredBy: "~/.aikaclaw",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/aikaclaw-backup.tar.gz",
      "Included 1 path:",
      "- state: ~/.aikaclaw",
      "Skipped 1 path:",
      "- workspace: ~/Projects/aikaclaw (covered by ~/.aikaclaw)",
      "Created /tmp/aikaclaw-backup.tar.gz",
      "Archive verification: passed",
    ]);
  });

  it("formats dry runs and pluralized counts", () => {
    const lines = formatBackupCreateSummary(
      makeResult({
        dryRun: true,
        assets: [
          {
            kind: "config",
            sourcePath: "/config",
            archivePath: "archive/config",
            displayPath: "~/.aikaclaw/config.json",
          },
          {
            kind: "credentials",
            sourcePath: "/oauth",
            archivePath: "archive/oauth",
            displayPath: "~/.aikaclaw/oauth",
          },
        ],
      }),
    );

    expect(lines).toEqual([
      "Backup archive: /tmp/aikaclaw-backup.tar.gz",
      "Included 2 paths:",
      "- config: ~/.aikaclaw/config.json",
      "- credentials: ~/.aikaclaw/oauth",
      "Dry run only; archive was not written.",
    ]);
  });
});
