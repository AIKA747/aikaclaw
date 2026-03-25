import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("aikaclaw", 16)).toBe("aikaclaw");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("aikaclaw-status-output", 10)).toBe("aikaclaw-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
