import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  EventFormData,
  EventFormFieldUpdate,
  EventIngestionState,
} from './eventIngestionSlice.types';
import type { RootState } from '@/store';

import { createSlice } from '@reduxjs/toolkit';
import { fetchFightersByCountry, submitEvent } from './thunks';

const initialForm: EventFormData = {
  country: '',
  idYt: '',
  startTime: '0',
  title: '',
  description: '',
  tags: [],
  fighterRed: '',
  fighterRedId: '',
  fighterBlue: '',
  fighterBlueId: '',
  fighterId: '',
};

const initialState: EventIngestionState = {
  form: initialForm,
  availableFighters: [],
  loadingFighters: false,
  fetchFightersError: null,
  submitting: false,
  submitSuccess: false,
  submitError: null,
};

const setFormField = <K extends keyof EventFormData>(
  form: EventFormData,
  field: K,
  value: EventFormData[K],
): void => {
  form[field] = value;
};

export const eventIngestionSlice = createSlice({
  name: 'eventIngestion',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<EventFormFieldUpdate>) => {
      setFormField(state.form, action.payload.field, action.payload.value);
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (state.form.tags.length < 10 && !state.form.tags.includes(action.payload)) {
        state.form.tags.push(action.payload);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.form.tags = state.form.tags.filter((t) => t !== action.payload);
    },
    resetForm: (state) => {
      state.form = initialForm;
      state.submitSuccess = false;
      state.submitError = null;
    },
    clearSubmitStatus: (state) => {
      state.submitSuccess = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFightersByCountry.pending, (state) => {
        state.loadingFighters = true;
        state.fetchFightersError = null;
        state.availableFighters = [];
      })
      .addCase(fetchFightersByCountry.fulfilled, (state, action) => {
        state.loadingFighters = false;
        state.availableFighters = action.payload;
      })
      .addCase(fetchFightersByCountry.rejected, (state, action) => {
        state.loadingFighters = false;
        state.fetchFightersError = action.payload ?? null;
      })
      .addCase(submitEvent.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.submitError = null;
      })
      .addCase(submitEvent.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitEvent.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload ?? null;
      });
  },
});

export const { updateField, addTag, removeTag, resetForm, clearSubmitStatus } =
  eventIngestionSlice.actions;

export const selectEventForm = (state: RootState) => state.eventIngestion.form;
export const selectAvailableFighters = (state: RootState) => state.eventIngestion.availableFighters;
export const selectLoadingFighters = (state: RootState) => state.eventIngestion.loadingFighters;
export const selectSubmitting = (state: RootState) => state.eventIngestion.submitting;
export const selectSubmitSuccess = (state: RootState) => state.eventIngestion.submitSuccess;
export const selectSubmitError = (state: RootState) => state.eventIngestion.submitError;

export default eventIngestionSlice.reducer;
