import { add, subtract, multiply, divide } from ".";

describe("add", () => {
  it("should work", () => {
    expect(add(1, 1)).toBe(2);
  });
});

describe("subtract", () => {
  it("should work", () => {
    expect(subtract(3, 2)).toBe(1);
  });
});

describe("multiply", () => {
  it("should work", () => {
    expect(multiply(3, 2)).toBe(6);
  });
});

describe("divide", () => {
  it("should work", () => {
    expect(divide(6, 2)).toBe(3);
  });
});
