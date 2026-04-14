import { spawnSync } from "node:child_process";
import process from "node:process";

/**
 * Map Windows OEM code pages to TextDecoder encoding labels that Node's
 * built-in ICU supports. Anything not listed (e.g. CP437, CP850) falls
 * back to UTF-8; those code pages are ASCII-compatible enough for English
 * command output, and the Encoding Standard does not define them anyway.
 */
const OEM_CODEPAGE_TO_TEXT_DECODER_LABEL: Record<number, string> = {
  866: "ibm866",
  874: "windows-874",
  932: "shift_jis",
  936: "gbk",
  949: "euc-kr",
  950: "big5",
  1250: "windows-1250",
  1251: "windows-1251",
  1252: "windows-1252",
  1253: "windows-1253",
  1254: "windows-1254",
  1255: "windows-1255",
  1256: "windows-1256",
  1257: "windows-1257",
  1258: "windows-1258",
  65001: "utf-8",
};

let cachedDecoder: ((bytes: Buffer) => string) | undefined;

function detectOemCodepage(): number | null {
  if (process.platform !== "win32") {
    return null;
  }
  try {
    const result = spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", "chcp"], {
      timeout: 2_000,
      windowsHide: true,
    });
    const out = result.stdout?.toString("utf8") ?? "";
    const match = out.match(/(\d{3,5})/);
    if (!match) {
      return null;
    }
    const parsed = Number.parseInt(match[1], 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function buildDecoder(): (bytes: Buffer) => string {
  const codepage = detectOemCodepage();
  const label = codepage != null ? OEM_CODEPAGE_TO_TEXT_DECODER_LABEL[codepage] : undefined;
  if (!label || label === "utf-8") {
    return (bytes) => bytes.toString("utf8");
  }
  try {
    const decoder = new TextDecoder(label, { fatal: false });
    return (bytes) => decoder.decode(bytes);
  } catch {
    return (bytes) => bytes.toString("utf8");
  }
}

/**
 * Decode bytes emitted by a Windows console program using the active OEM
 * code page. On non-Windows hosts, or when the code page is unavailable or
 * unsupported by TextDecoder, falls back to UTF-8.
 *
 * The detection result is cached for the process lifetime because the OEM
 * code page does not change while the gateway onboarding runs.
 */
export function decodeWindowsOemBytes(bytes: Buffer): string {
  if (!cachedDecoder) {
    cachedDecoder = buildDecoder();
  }
  return cachedDecoder(bytes);
}

// Visible for tests.
export function __resetWindowsOemDecoderForTests(): void {
  cachedDecoder = undefined;
}
