import { configureStore } from "@reduxjs/toolkit";
import fighterReducer from "./Fighters";
import mainEventsReducer from "./MainEvents";
import topEventsReducer from "./TopEvents";

export const store = configureStore({
  reducer: {
    fighter: fighterReducer,
    mainEvents: mainEventsReducer,
    topEvents: topEventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
