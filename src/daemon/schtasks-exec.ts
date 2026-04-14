import process from "node:process";
import { runCommandWithTimeout } from "../process/exec.js";
import { decodeWindowsOemBytes } from "../process/windows-oem-decoder.js";

const SCHTASKS_TIMEOUT_MS = 15_000;
const SCHTASKS_NO_OUTPUT_TIMEOUT_MS = 5_000;

export async function execSchtasks(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number }> {
  // schtasks.exe emits localized text in the active Windows OEM code page
  // (e.g. GBK/CP936 on Chinese Windows). Decoding those bytes as UTF-8
  // yields replacement-char garble like "����: �ܾ����ʡ�" instead of
  // "错误: 拒绝访问。". Decode via the OEM code page on Windows so the
  // gateway install error surfaces the real message.
  const result = await runCommandWithTimeout(["schtasks", ...args], {
    timeoutMs: SCHTASKS_TIMEOUT_MS,
    noOutputTimeoutMs: SCHTASKS_NO_OUTPUT_TIMEOUT_MS,
    ...(process.platform === "win32" ? { outputDecoder: decodeWindowsOemBytes } : {}),
  });
  const timeoutDetail =
    result.termination === "timeout"
      ? `schtasks timed out after ${SCHTASKS_TIMEOUT_MS}ms`
      : result.termination === "no-output-timeout"
        ? `schtasks produced no output for ${SCHTASKS_NO_OUTPUT_TIMEOUT_MS}ms`
        : "";
  return {
    stdout: result.stdout,
    stderr: result.stderr || timeoutDetail,
    code: typeof result.code === "number" ? result.code : result.killed ? 124 : 1,
  };
}
