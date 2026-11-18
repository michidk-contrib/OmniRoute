import test from "node:test";
import assert from "node:assert/strict";

const { estimateInputTokens } = await import("../../open-sse/utils/usageEstimation.ts");
const { isInputTokenCountPlausible } = await import("../../open-sse/utils/usageTracking.ts");

test("repeated stream usage estimates serialize a long request once", () => {
  let serializations = 0;
  const body = {
    messages: [{ role: "user", content: "long context ".repeat(8_000) }],
    toJSON() {
      serializations += 1;
      return { messages: this.messages };
    },
  };

  const expected = estimateInputTokens(body);
  assert.ok(expected > 0);
  for (let chunk = 0; chunk < 100; chunk += 1) {
    assert.equal(estimateInputTokens(body), expected);
  }
  assert.equal(serializations, 1);
});

test("usage plausibility checks serialize a long request once", () => {
  let serializations = 0;
  const body = {
    messages: [{ role: "user", content: "long context ".repeat(8_000) }],
    toJSON() {
      serializations += 1;
      return { messages: this.messages };
    },
  };

  for (let chunk = 0; chunk < 100; chunk += 1) {
    assert.equal(isInputTokenCountPlausible(1_000, body), true);
  }
  assert.equal(serializations, 1);
});
