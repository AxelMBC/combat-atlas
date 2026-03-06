import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCountryData } from "@/services/country.service";

export const fetchCountry = createAsyncThunk(
  "country/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      return await getCountryData(slug);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error fetching country data";
      return rejectWithValue(message);
    }
  }
);
