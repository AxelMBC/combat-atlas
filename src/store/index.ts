import { configureStore } from "@reduxjs/toolkit";
import fighterReducer from "./Fighters";
import mainEventsReducer from "./MainEvents";
import topEventsReducer from "./TopEvents";

// Thunk viene incluido en RTK por defecto, no necesitas importar nada extra
export const store = configureStore({
  reducer: {
    fighter: fighterReducer,
    mainEvents: mainEventsReducer,
    topEvents: topEventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
