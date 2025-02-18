import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCategory, deleteCategory, fetchCategory } from "../api/categoryApi";

export const addSubCategory = createAsyncThunk("category/add", async (data, thunkAPI) => {
  try {
    const response = await addCategory(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCategory = createAsyncThunk("category/get", async (data, thunkAPI) => {
  try {
    const response = await fetchCategory(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


// export const getCategoryById = createAsyncThunk("category/getEmergencyService", async (data, thunkAPI) => {
//   try {
//     const response = await getCategoryById(data);
//     return response.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data);
//   }
// });


export const categoryDelete = createAsyncThunk("category/delete", async (id, thunkAPI) => {
  try {
    const response = await deleteCategory(id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});


const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    currentCategory:{},
    loading: false,
    error: null,
    totalPages: null,
    currentPage: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Create  
      .addCase(addSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create service."
      })

      // delete  
      .addCase(categoryDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(categoryDelete.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(categoryDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to delete service."
      })

      // fetch category 
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.categories;
        state.currentPage = action.payload?.currentPage;
        state.totalPages = action.payload?.totalPages;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch services."
      })

      // fetch category by id 
    //   .addCase(getCategoryById.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getCategoryById.fulfilled, (state, action) => {
    //     state.loading = false;
    //   })
    //   .addCase(getCategoryById.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload?.error || "Failed to update service."
    //   })
  },
});

export default categorySlice.reducer;
