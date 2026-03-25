import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/aikaclaw" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchAikaClawChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveAikaClawUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopAikaClawChrome: vi.fn(async () => {}),
}));
