import { describe, expect, it } from "vitest";
import { isAikaClawManagedMatrixDevice, summarizeMatrixDeviceHealth } from "./device-health.js";

describe("matrix device health", () => {
  it("detects AikaClaw-managed device names", () => {
    expect(isAikaClawManagedMatrixDevice("AikaClaw Gateway")).toBe(true);
    expect(isAikaClawManagedMatrixDevice("AikaClaw Debug")).toBe(true);
    expect(isAikaClawManagedMatrixDevice("Element iPhone")).toBe(false);
    expect(isAikaClawManagedMatrixDevice(null)).toBe(false);
  });

  it("summarizes stale AikaClaw-managed devices separately from the current device", () => {
    const summary = summarizeMatrixDeviceHealth([
      {
        deviceId: "du314Zpw3A",
        displayName: "AikaClaw Gateway",
        current: true,
      },
      {
        deviceId: "BritdXC6iL",
        displayName: "AikaClaw Gateway",
        current: false,
      },
      {
        deviceId: "G6NJU9cTgs",
        displayName: "AikaClaw Debug",
        current: false,
      },
      {
        deviceId: "phone123",
        displayName: "Element iPhone",
        current: false,
      },
    ]);

    expect(summary.currentDeviceId).toBe("du314Zpw3A");
    expect(summary.currentAikaClawDevices).toEqual([
      expect.objectContaining({ deviceId: "du314Zpw3A" }),
    ]);
    expect(summary.staleAikaClawDevices).toEqual([
      expect.objectContaining({ deviceId: "BritdXC6iL" }),
      expect.objectContaining({ deviceId: "G6NJU9cTgs" }),
    ]);
  });
});
