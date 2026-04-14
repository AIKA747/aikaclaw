import { beforeEach, describe, expect, it, vi } from "vitest";

const runCommandWithTimeout = vi.hoisted(() => vi.fn());
const decodeWindowsOemBytes = vi.hoisted(() => vi.fn((bytes: Buffer) => bytes.toString("utf8")));

vi.mock("../process/exec.js", () => ({
  runCommandWithTimeout: (...args: unknown[]) => runCommandWithTimeout(...args),
}));

vi.mock("../process/windows-oem-decoder.js", () => ({
  decodeWindowsOemBytes: (bytes: Buffer) => decodeWindowsOemBytes(bytes),
}));

const { execSchtasks } = await import("./schtasks-exec.js");

beforeEach(() => {
  runCommandWithTimeout.mockReset();
  decodeWindowsOemBytes.mockClear();
});

describe("execSchtasks", () => {
  it("runs schtasks with bounded timeouts", async () => {
    runCommandWithTimeout.mockResolvedValue({
      stdout: "ok",
      stderr: "",
      code: 0,
      signal: null,
      killed: false,
      termination: "exit",
    });

    await expect(execSchtasks(["/Query"])).resolves.toEqual({
      stdout: "ok",
      stderr: "",
      code: 0,
    });
    const [argv, opts] = runCommandWithTimeout.mock.calls[0] as [string[], Record<string, unknown>];
    expect(argv).toEqual(["schtasks", "/Query"]);
    expect(opts.timeoutMs).toBe(15_000);
    expect(opts.noOutputTimeoutMs).toBe(5_000);
    if (process.platform === "win32") {
      expect(typeof opts.outputDecoder).toBe("function");
    } else {
      expect(opts.outputDecoder).toBeUndefined();
    }
  });

  it("maps a timeout into a non-zero schtasks result", async () => {
    runCommandWithTimeout.mockResolvedValue({
      stdout: "",
      stderr: "",
      code: null,
      signal: "SIGTERM",
      killed: true,
      termination: "timeout",
    });

    await expect(execSchtasks(["/Create"])).resolves.toEqual({
      stdout: "",
      stderr: "schtasks timed out after 15000ms",
      code: 124,
    });
  });
});
