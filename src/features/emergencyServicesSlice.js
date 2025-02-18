import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createEmergencyService, deleteEmergencyService, editEmergencyServices, getEmergencyServices } from "../api/emergencyServiceApi";


// service create
export const emergencyServiceCreate = createAsyncThunk("emergencyService/create", async (data, thunkAPI) => {
  try {
    const response = await createEmergencyService(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


// service edit
export const emergencyServiceEdit = createAsyncThunk("emergencyService/edit", async (data, thunkAPI) => {
  try {
    const response = await editEmergencyServices(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// fetching services 
export const getServices = createAsyncThunk("emergencyService/getEmergencyService", async (data, thunkAPI) => {
  try {
    const response = await getEmergencyServices(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// deleting service
export const deleteService = createAsyncThunk("emergencyService/delete", async (id, thunkAPI) => {
  try {
    const response = await deleteEmergencyService(id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


const emergencyServiceSlice = createSlice({
  name: "emergencyService",
  initialState: {
    data: [],
    loading: false,
    error: null,
    totalPages: null,
    currentPage: null,
    filter: {}
  },
  reducers: {
    updateSearchKeyword: (state, action) => {
      state.filter.searchKeyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create service 
      .addCase(emergencyServiceCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emergencyServiceCreate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(emergencyServiceCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create service."
      })

      // delete service 
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to delete service."
      })

      // fetch service 
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.services.services;
        state.currentPage = action.payload.services.currentPage;
        state.totalPages = action.payload.services.totalPages;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch services."
      })

      // update service 
      .addCase(emergencyServiceEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emergencyServiceEdit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(emergencyServiceEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update service."
      })
  },
});

export const { updateSearchKeyword } = emergencyServiceSlice.actions;
export default emergencyServiceSlice.reducer;
