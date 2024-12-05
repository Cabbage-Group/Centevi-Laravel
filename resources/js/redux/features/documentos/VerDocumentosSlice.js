import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

// Acción para obtener documentos de un paciente por ID
export const fetchVerDocumentosSlice = createAsyncThunk(
  'documentos/fetchDocumentosByPacienteId',
  async (idPaciente) => {
    const response = await axios.get(`${API}/documentos/${idPaciente}`);
    return response.data;
  }
);

const VerDocumentosSlice = createSlice({
  name: 'documentos',
  initialState: {
    documentos: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerDocumentosSlice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVerDocumentosSlice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documentos = action.payload;
      })
      .addCase(fetchVerDocumentosSlice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.documentos = []
      });
  },
});

export default VerDocumentosSlice.reducer;
