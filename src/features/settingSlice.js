import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSettingsApi, fetchSettings, updateSettingsApi } from "../api/configApi";
export const getSettings = createAsyncThunk("settings/getSettings", async ( thunkAPI) => {
  try {
    const response = await fetchSettings();
    console.log(response.data)
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateSettings = createAsyncThunk("settings/update", async (data, thunkAPI) => {
  try {
    const response = await updateSettingsApi(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createSettings = createAsyncThunk("settings/create", async (data, thunkAPI) => {
    try {
      const response = await createSettingsApi(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  });



// Redux Slice
const settingSlice = createSlice({
  name: "settings",
  initialState: {
    setting: {},
    loading: false,
    error: null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.setting = action.payload?.settings?.[0];
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed.";
      })

      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update.";
      })

      .addCase(createSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSettings.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed.";
      })
  },
});

export default settingSlice.reducer;
