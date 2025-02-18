import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRequests, updateRequest } from "../api/requestApi";
export const getRequests = createAsyncThunk("request/getRequest", async (data, thunkAPI) => {
  try {
    console.log(data)
    const response = await fetchRequests(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateRequestStatus = createAsyncThunk("request/update", async (data, thunkAPI) => {
  try {
    const response = await updateRequest(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});



// Redux Slice
const requestSlice = createSlice({
  name: "request",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    totalPages: null,
    currentPage: 1,
    filter:{}
  },
  reducers: {
    updateFilter: (state, action) => {
      console.log(action.payload)
      const reqFilters = action?.payload
      state.filter = {...state.filter,...reqFilters}
    },
    resetFilter:(state,action)=>{
      state.filter = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload?.requests?.data;
        state.currentPage = action.payload?.requests?.currentPage;
        state.totalPages = action.payload?.requests?.totalPages;
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch requests.";
      })

      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update status.";
      })
  },
});

export const { updateFilter,resetFilter } = requestSlice.actions;
export default requestSlice.reducer;
