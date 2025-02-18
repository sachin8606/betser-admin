import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCommunicationUser, getUsersChatList, uploadFile } from "../api/communicationApi";

// Async Thunks for API Calls
export const getChatUser = createAsyncThunk("communication/getChatUser", async (data, thunkAPI) => {
  try {
    const response = await getCommunicationUser(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getChatList = createAsyncThunk("communication/getChatList", async (_, thunkAPI) => {
  try {
    const response = await getUsersChatList();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const uploadMedia = createAsyncThunk("communication/uploadMedia", async (data, thunkAPI) => {
  try {
    const response = await uploadFile(data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Redux Slice
const communicationSlice = createSlice({
  name: "communication",
  initialState: {
    currentChat: [],   // Stores chat messages for the selected user
    userList: [],      // List of users for the admin panel
    userId: null,      // Stores selected user ID
    loading: false,
    error: null,
    totalPages: null,
    currentPage: null,
    filter: {},
    fileUploading:false,
  },
  reducers: {
    // ✅ Add New Message to Current Chat
    addNewMessage: (state, action) => {
      const newMessage = action.payload;
      console.log(newMessage)
      console.log(state.userId)
      if (Number(newMessage.senderId) === Number(state.userId) || Number(newMessage.receiverId) === Number(state.userId)) {
        state.currentChat.push(newMessage);
      }
    },
    setChatSelectedUserId: (state,action) => {
      state.userId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload.data;
      })
      .addCase(getChatUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch chat.";
      })

      .addCase(getChatList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.data;
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch chats.";
      })

      .addCase(uploadMedia.pending, (state) => {
        state.fileUploading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.fileUploading = false;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.fileUploading = false;
        state.error = action.payload?.error || "Failed to upload file.";
      });
  },
});

// ✅ Export the new action
export const { addNewMessage,setChatSelectedUserId } = communicationSlice.actions;

// ✅ Export the reducer
export default communicationSlice.reducer;
