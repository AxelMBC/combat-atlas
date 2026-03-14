import type { RootState } from "@/store";
import { useSelector } from "react-redux"
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectMainEventsState } from "@/store/MainEvents"
import { getCountryData } from "@/services/country.service";
const TTL_MS = 30 * 60 * 1000;

interface SessionCache {
  data: Awaited<ReturnType<typeof getCountryData>>;
  fetchedAt: number;
}

const readCache = (slug: string): SessionCache["data"] | null => {
  try {
    const raw = sessionStorage.getItem(`country_${slug}`);
    if (!raw) return null;

    const cached: SessionCache = JSON.parse(raw);
    const isExpired = Date.now() - cached.fetchedAt > TTL_MS;

    if (isExpired) {
      sessionStorage.removeItem(`country_${slug}`);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = (slug: string, data: SessionCache["data"]): void => {
  try {
    const payload: SessionCache = { data, fetchedAt: Date.now() };
    sessionStorage.setItem(`country_${slug}`, JSON.stringify(payload));
  } catch {
    console.log("App sin cache: sessionStorage no disponible o bloqueado");
  }
};

export const fetchCountry = createAsyncThunk(
  "country/fetchBySlug",
  async (slug: string, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { mainEventsList } = useSelector(selectMainEventsState)

    if (mainEventsList.length > 0) {
      return {
        allFights: state.mainEvents.mainEventsList,
        topEvents: state.topEvents.topEventsList,
        topFighters: state.fighter.fightersList,
      };
    }

    const cached = readCache(slug);
    if (cached) return cached;

    try {
      const data = await getCountryData(slug);
      writeCache(slug, data);
      return data;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error fetching country data";
      return rejectWithValue(message);
    }
  }
);
