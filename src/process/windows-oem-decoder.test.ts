import { describe, expect, it } from "vitest";

// The decoder defaults to UTF-8 off-Windows, so these tests exercise the
// TextDecoder path directly to prove that GBK bytes (which is what Chinese
// Windows schtasks emits) round-trip into real characters rather than the
// "����: �ܾ����ʡ�" replacement-char garble reported in issue #5.
describe("TextDecoder GBK support (issue #5)", () => {
  it("decodes the '错误: 拒绝访问。' byte sequence emitted by CN Windows schtasks", () => {
    // Bytes for "错误: 拒绝访问。" in GBK (CP936).
    const gbkBytes = Buffer.from([
      0xb4, 0xed, 0xce, 0xf3, 0x3a, 0x20, 0xbe, 0xdc, 0xbe, 0xf8, 0xb7, 0xc3, 0xce, 0xca, 0xa1,
      0xa3,
    ]);
    const decoder = new TextDecoder("gbk", { fatal: false });
    expect(decoder.decode(gbkBytes)).toBe("错误: 拒绝访问。");
  });

  it("shows the same bytes mis-decoded as UTF-8 reproduce the reported garble", () => {
    const gbkBytes = Buffer.from([
      0xb4, 0xed, 0xce, 0xf3, 0x3a, 0x20, 0xbe, 0xdc, 0xbe, 0xf8, 0xb7, 0xc3, 0xce, 0xca, 0xa1,
      0xa3,
    ]);
    const asUtf8 = gbkBytes.toString("utf8");
    expect(asUtf8).toContain("\uFFFD");
  });
});
