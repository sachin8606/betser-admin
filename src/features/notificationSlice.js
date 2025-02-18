import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotifications, updateNotification } from "../api/notificationApi";
// Async Thunks for API Calls
export const getNotifications = createAsyncThunk("notification/getNotifications", async (data, thunkAPI) => {
  try {
    const response = await fetchNotifications(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateNotificationStatus = createAsyncThunk("notification/updateNotificationStatus", async (data, thunkAPI) => {
  try {
    const response = await updateNotification(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});



// Redux Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    totalPages: null,
    currentPage: null,
    filter: {},
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload?.data?.notifications;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch notifications.";
      })

      .addCase(updateNotificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateNotificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update status.";
      })
  },
});

export default notificationSlice.reducer;
