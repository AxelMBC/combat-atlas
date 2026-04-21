import type { MainEvent } from "@/types/fightEvent.types";

import { afterEach, describe, expect, it, vi } from "vitest";

import pickRandomEvent from "./pickRandomEvent";

const makeEvent = (id: number): MainEvent => ({
  id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: "",
  tags: [],
  startTime: "2026-01-01T00:00:00.000Z",
});

describe("pickRandomEvent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns both randomEvent and randomIndex", () => {
    const input = [makeEvent(1), makeEvent(2), makeEvent(3)];
    const { randomEvent, randomIndex } = pickRandomEvent(input);
    expect(randomEvent).toBeDefined();
    expect(typeof randomIndex).toBe("number");
  });

  it("picks index 0 when Math.random is stubbed to 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const input = [makeEvent(1), makeEvent(2), makeEvent(3)];
    expect(pickRandomEvent(input)).toEqual({
      randomEvent: input[0],
      randomIndex: 0,
    });
  });

  it("picks the last index when Math.random is stubbed to ~0.999", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999999);
    const input = [makeEvent(1), makeEvent(2), makeEvent(3)];
    const { randomEvent, randomIndex } = pickRandomEvent(input);
    expect(randomIndex).toBe(input.length - 1);
    expect(randomEvent).toBe(input[input.length - 1]);
  });

  it("returns the element at the chosen index", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const input = [makeEvent(1), makeEvent(2), makeEvent(3), makeEvent(4)];
    const { randomEvent, randomIndex } = pickRandomEvent(input);
    expect(randomEvent).toBe(input[randomIndex]);
  });
});
