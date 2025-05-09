import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from '../../../config/config.js';

const API_URL = "http://127.0.0.1:3008";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ id_usuario, receptorId }) => {
    const response = await axios.post(`${API_URL}/chat/messages`, { id_usuario, receptorId });
    return response.data.data;
  }
);

export const uploadFile = createAsyncThunk(
  "chat/uploadFile",
  async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }
);

export const fetchUsuariosOrderByMessages = createAsyncThunk(
  "chat/fetchUsuariosOrderByMessages",
  async (id_usuario) => {
    const response = await axios.post(`${API_URL}/usuarios/get`, { id_usuario });
    return response.data;
  }
);

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations ",
  async ({ id_usuario, name }) => {
    const response = await axios.post(`${API_URL}/chat/conversations`,
      { id_usuario, name }
    );
    console.log('response:', response)
    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversation: {},
    messages: [],
    usuariosByMessages: [],
    conversations: [],
    conversationsLength: 0,
    status: "succeeded",
    status_conversations: 'idle'
  },
  reducers: {
    addMessage: (state, action) => {

      const nuevoMensaje = action.payload;

      if (nuevoMensaje.tempId) {
        const index = state.messages.findIndex(m => m.id === nuevoMensaje.tempId);
        if (index !== -1) {
          state.messages[index] = nuevoMensaje;
        } else {
          state.messages.push(nuevoMensaje);
        }
      } else {
        state.messages.push(nuevoMensaje);
      }
    },
    updateConversations: (state, action) => {
      state.conversations = action.payload;
      state.conversationsLength = action.payload.length;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversation = action.payload.conversacion;
        state.messages = action.payload.mensajes;
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
      })
      .addCase(fetchUsuariosOrderByMessages.fulfilled, (state, action) => {
        state.status_conversations = "succeeded";
        state.usuariosByMessages = action.payload;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status_conversations = "succeeded";
        state.conversations = action.payload.data;
        state.conversationsLength = action.payload.data.length;
      });
  },
});

export const { addMessage, updateConversations, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
