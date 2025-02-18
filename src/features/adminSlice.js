import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAdmin,
  registerAdmin,
  getUsers,
  updateUser,
  exportUsersData,
  getHelpRequests,
  acknowledgeHelpRequest,
  getAdminDetails,
  getUserDetails,
} from "../api/adminApi";

export const validateToken = createAsyncThunk("admin/validateToken", async (_, thunkAPI) => {
  try {
    const response = await getAdminDetails();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Invalid token");
  }
});

// Async thunk for admin login
export const adminLogin = createAsyncThunk("admin/login", async (credentials, thunkAPI) => {
  try {
    const response = await loginAdmin(credentials);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("betser-admin", response.data.id)
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for admin registration
export const adminRegister = createAsyncThunk("admin/register", async (adminData, thunkAPI) => {
  try {
    const response = await registerAdmin(adminData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk("admin/getUsers", async (data, thunkAPI) => {
  try {
    const response = await getUsers(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchUserDetails = createAsyncThunk("admin/getUserDetails", async (id, thunkAPI) => {
  try {
    const response = await getUserDetails(id);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for updating user details
export const updateUserDetails = createAsyncThunk("admin/updateUser", async ({ id, data }, thunkAPI) => {
  try {
    const response = await updateUser(id, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for exporting users
export const exportUsers = createAsyncThunk("admin/exportUsers", async (filter, thunkAPI) => {
  try {
    await exportUsersData(filter);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching help requests
export const fetchHelpRequests = createAsyncThunk("admin/getHelpRequests", async (_, thunkAPI) => {
  try {
    const response = await getHelpRequests();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for acknowledging help requests
export const acknowledgeHelp = createAsyncThunk("admin/acknowledgeHelp", async (requestId, thunkAPI) => {
  try {
    const response = await acknowledgeHelpRequest(requestId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminInfo: null,
    users: [],
    helpRequests: [],
    loading: false,
    error: null,
    tokenValidated: false,
    currentUser: {},
    totalPagesUsers: null,
    currentPageUser: null,
    usersFilter: {}
  },
  reducers: {
    logout: (state) => {
      state.adminInfo = null;
      localStorage.clear()
    },
    updateUserSearchInput: (state, action) => {
      const value = action.payload;
      state.usersFilter.searchKeyword = value;
    },
  },
  extraReducers: (builder) => {
    builder

      // Token Validation
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = action.payload;
        state.tokenValidated = true;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.tokenValidated = false;
        state.error = action.payload || "Invalid token";
        localStorage.removeItem("token");
      })
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = action.payload;
        state.tokenValidated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Login failed";
      })

      // Admin Registration
      .addCase(adminRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Registration failed";
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPagesUsers = action.payload.totalPages;
        state.currentPageUser = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch users";
      })

      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch users";
      })

      // Update User Details
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Update failed";
      })

      // Fetch Help Requests
      .addCase(fetchHelpRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHelpRequests.fulfilled, (state, action) => {
        state.helpRequests = action.payload;
      })
      .addCase(fetchHelpRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed";
      })

      // Acknowledge Help Request
      .addCase(acknowledgeHelp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acknowledgeHelp.fulfilled, (state, action) => {
        const index = state.helpRequests.findIndex((req) => req.id === action.payload.id);
        if (index !== -1) {
          state.helpRequests[index] = action.payload;
        }
      })
      .addCase(acknowledgeHelp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed";
      })
  },
});

export const { logout, updateUserSearchInput } = adminSlice.actions;
export default adminSlice.reducer;
