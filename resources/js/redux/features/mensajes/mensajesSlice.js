import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3008";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ id_usuario, receptorId }) => {
    const response = await axios.post(`${API_URL}/chat/messages`, { id_usuario, receptorId });
    return response.data.data.mensajes;
  }
);


export const uploadFile = createAsyncThunk(
  "chat/uploadFile",
  async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    status: "idle",
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        console.log(' action.payload:', action.payload)
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.fileData = action.payload;
      })
      .addCase(uploadFile.rejected, (state) => {
        state.uploadStatus = "failed";
      });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
