import type { MainEvent } from "@/types/fightEvent.types";

import { afterEach, describe, expect, it, vi } from "vitest";

import shuffleArray from "./shuffleArray";

const makeEvent = (id: number): MainEvent => ({
  id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: "",
  tags: [],
  startTime: "2026-01-01T00:00:00.000Z",
});

describe("shuffleArray", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an array of the same length", () => {
    const input = [makeEvent(1), makeEvent(2), makeEvent(3), makeEvent(4)];
    expect(shuffleArray(input)).toHaveLength(input.length);
  });

  it("does not mutate the input array", () => {
    const input = [makeEvent(1), makeEvent(2), makeEvent(3)];
    const snapshot = [...input];
    shuffleArray(input);
    expect(input).toEqual(snapshot);
  });

  it("contains the same elements as the input", () => {
    const input = [makeEvent(1), makeEvent(2), makeEvent(3), makeEvent(4)];
    const result = shuffleArray(input);
    expect(result).toEqual(expect.arrayContaining(input));
    expect(input).toEqual(expect.arrayContaining(result));
  });

  it("is deterministic when Math.random is stubbed to 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const input = [makeEvent(1), makeEvent(2), makeEvent(3)];
    const result = shuffleArray(input);
    expect(result.map((e) => e.id)).toEqual([2, 3, 1]);
  });

  it("returns an empty array when given an empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("returns an equivalent single-element array", () => {
    const input = [makeEvent(42)];
    expect(shuffleArray(input)).toEqual(input);
  });
});
