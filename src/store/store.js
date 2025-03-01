import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";
import emergencyReducer from "../features/emergencyServicesSlice";
import communicationReducer from "../features/communicationSlice";
import categoryReducer from "../features/categorySlice";
import notificationReducer from "../features/notificationSlice";
import requestsReducer from "../features/requestSlice";
import settingReducer from "../features/settingSlice";
const store = configureStore({
  reducer: {
    admin: adminReducer,
    emergencyService:emergencyReducer,
    communication:communicationReducer,
    category:categoryReducer,
    notification:notificationReducer,
    request:requestsReducer,
    setting:settingReducer
  },
});

export default store;
