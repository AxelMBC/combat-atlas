import { configureStore } from "@reduxjs/toolkit";
import countryReducer from "./country/countrySlice";
import eventIngestionReducer from "./eventIngestion/eventIngestionSlice";

export const store = configureStore({
  reducer: {
    country: countryReducer,
    eventIngestion: eventIngestionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
