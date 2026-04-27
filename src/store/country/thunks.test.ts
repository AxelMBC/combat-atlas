import type { Fighter } from "@/types/fighter.types";
import type { MainEvent } from "@/types/fightEvent.types";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCountryData } from "@/services/country.service";
import { fetchCountry } from "./thunks";

vi.mock("@/services/country.service", () => ({
  getCountryData: vi.fn(),
}));

const mockedGetCountryData = vi.mocked(getCountryData);

const TTL_MS = 30 * 60 * 1000;
const NOW = new Date("2026-04-27T12:00:00.000Z").getTime();

const makeFighter = (id: string): Fighter => ({
  _id: id,
  name: `Fighter ${id}`,
  record: "10-0",
  nickName: "Nick",
  image: "",
  fightsCounter: 10,
});

const makeEvent = (id: number): MainEvent => ({
  id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: "",
  tags: [],
  startTime: "2026-01-01T00:00:00.000Z",
});

const makePayload = () => ({
  topFighters: [makeFighter("a"), makeFighter("b")],
  allFights: [makeEvent(1), makeEvent(2)],
  topEvents: [makeEvent(3)],
});

const runThunk = async (slug: string) => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  return fetchCountry(slug)(dispatch, getState, undefined);
};

describe("fetchCountry thunk", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    mockedGetCountryData.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("calls the service on cache miss and writes the result to sessionStorage", async () => {
    const payload = makePayload();
    mockedGetCountryData.mockResolvedValueOnce(payload);

    const result = await runThunk("ar");

    expect(mockedGetCountryData).toHaveBeenCalledWith("ar");
    expect(result.type).toBe(fetchCountry.fulfilled.type);
    expect(result.payload).toEqual(payload);

    const stored = sessionStorage.getItem("country_ar");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)).toEqual({
      data: payload,
      fetchedAt: NOW,
    });
  });

  it("returns cached data without calling the service when cache is fresh", async () => {
    const payload = makePayload();
    sessionStorage.setItem(
      "country_ar",
      JSON.stringify({ data: payload, fetchedAt: NOW - 1000 })
    );

    const result = await runThunk("ar");

    expect(mockedGetCountryData).not.toHaveBeenCalled();
    expect(result.type).toBe(fetchCountry.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("removes expired cache entries and refetches", async () => {
    const stalePayload = makePayload();
    const freshPayload = { ...makePayload(), topEvents: [makeEvent(99)] };

    sessionStorage.setItem(
      "country_ar",
      JSON.stringify({ data: stalePayload, fetchedAt: NOW - TTL_MS - 1 })
    );
    mockedGetCountryData.mockResolvedValueOnce(freshPayload);

    const result = await runThunk("ar");

    expect(mockedGetCountryData).toHaveBeenCalledWith("ar");
    expect(result.payload).toEqual(freshPayload);

    const stored = sessionStorage.getItem("country_ar");
    expect(JSON.parse(stored as string)).toEqual({
      data: freshPayload,
      fetchedAt: NOW,
    });
  });

  it("falls through to the service when cached JSON is corrupted", async () => {
    sessionStorage.setItem("country_ar", "{not valid json");
    const payload = makePayload();
    mockedGetCountryData.mockResolvedValueOnce(payload);

    const result = await runThunk("ar");

    expect(mockedGetCountryData).toHaveBeenCalledWith("ar");
    expect(result.type).toBe(fetchCountry.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("still fulfills when sessionStorage.setItem throws", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    const payload = makePayload();
    mockedGetCountryData.mockResolvedValueOnce(payload);

    const result = await runThunk("ar");

    expect(result.type).toBe(fetchCountry.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("rejects with the Error message when the service throws an Error", async () => {
    mockedGetCountryData.mockRejectedValueOnce(new Error("network down"));

    const result = await runThunk("ar");

    expect(result.type).toBe(fetchCountry.rejected.type);
    expect(result.payload).toBe("network down");
  });

  it("rejects with the default message when the service throws a non-Error", async () => {
    mockedGetCountryData.mockRejectedValueOnce("boom");

    const result = await runThunk("ar");

    expect(result.type).toBe(fetchCountry.rejected.type);
    expect(result.payload).toBe("Error fetching country data");
  });
});
