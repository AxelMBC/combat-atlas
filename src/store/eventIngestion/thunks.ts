import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCountryData } from "@/services/country.service";
import { submitEventData } from "@/services/event.service";
import type { EventFormData } from "./eventIngestionSlice.types";

export const fetchFightersByCountry = createAsyncThunk(
  "eventIngestion/fetchFightersByCountry",
  async (slug: string, { rejectWithValue }) => {
    try {
      const data = await getCountryData(slug);
      return data.topFighters;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al cargar peleadores";
      return rejectWithValue(message);
    }
  }
);

export const submitEvent = createAsyncThunk(
  "eventIngestion/submitEvent",
  async (formData: EventFormData, { rejectWithValue }) => {
    try {
      const result = await submitEventData(formData);
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al enviar el evento";
      return rejectWithValue(message);
    }
  }
);
