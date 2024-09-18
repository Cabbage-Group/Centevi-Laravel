import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const deleteDocumento = createAsyncThunk(
  'documentos/deleteDocumento',
  async (id_documento) => {
    const response = await axios.delete(`${API}/documentos/${id_documento}`);
    return response.data;
  }
);

const deleteDocumentoSlice = createSlice({
  name: 'documentos',
  initialState: {
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteDocumento.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDocumento.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Puedes actualizar el estado aquí si es necesario
        // Por ejemplo, podrías actualizar una lista de documentos
      })
      .addCase(deleteDocumento.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default deleteDocumentoSlice.reducer;
