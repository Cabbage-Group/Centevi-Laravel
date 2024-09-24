import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Async thunk for uploading a document
export const uploadDocumento = createAsyncThunk(
  'documentos/uploadDocumento',
  async ({ documento, id_paciente }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('documento', documento);
      formData.append('id_paciente', id_paciente);

      const response = await axios.post(`${API}/documentos/subir`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al subir el documento');
    }
  }
);

const documentosSlice = createSlice({
  name: 'documentos',
  initialState: {
    uploading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    resetStatus: (state) => {
      state.uploading = false;
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocumento.pending, (state) => {
        state.uploading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(uploadDocumento.fulfilled, (state, action) => {
        state.uploading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(uploadDocumento.rejected, (state, action) => {
        state.uploading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetStatus } = documentosSlice.actions;
export default documentosSlice.reducer;
