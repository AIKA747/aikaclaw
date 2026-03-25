import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          AIKACLAW_STATE_DIR: "/tmp/aikaclaw-state",
          AIKACLAW_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "aikaclaw-gateway",
        windowsTaskName: "AikaClaw Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/aikaclaw-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/aikaclaw-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "aikaclaw-gateway",
        windowsTaskName: "AikaClaw Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u aikaclaw-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "aikaclaw-gateway",
        windowsTaskName: "AikaClaw Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "AikaClaw Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "aikaclaw gateway install",
        startCommand: "aikaclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.aikaclaw.gateway.plist",
        systemdServiceName: "aikaclaw-gateway",
        windowsTaskName: "AikaClaw Gateway",
      }),
    ).toEqual([
      "aikaclaw gateway install",
      "aikaclaw gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.aikaclaw.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "aikaclaw gateway install",
        startCommand: "aikaclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.aikaclaw.gateway.plist",
        systemdServiceName: "aikaclaw-gateway",
        windowsTaskName: "AikaClaw Gateway",
      }),
    ).toEqual([
      "aikaclaw gateway install",
      "aikaclaw gateway",
      "systemctl --user start aikaclaw-gateway.service",
    ]);
  });
});
