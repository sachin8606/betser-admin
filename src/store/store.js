import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

export default store;
