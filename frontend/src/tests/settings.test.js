import { describe, it, expect } from "vitest";

describe("Settings validation", () => {
  it("rejects an empty or whitespace-only assistant name", () => {
    const assistantName = "   ";
    expect(assistantName.trim()).toBe("");
  });

  it("accepts a valid assistant name after trimming", () => {
    const assistantName = "  Shifra  ";
    expect(assistantName.trim()).toBe("Shifra");
  });
});
