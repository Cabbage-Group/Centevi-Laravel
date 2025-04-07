import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchInterfuerza = createAsyncThunk(
  'interfuerza/fetchInterfuerza',
  async () => {
    try {
      const response = await axios.post(`${API}/verificar-interfuerza`, {});


      return response.data;
    } catch (error) {
      console.error('Error fetching interfuerza:', error.response.data);
      throw error;
    }
  }
);

const interfuerzaSlice = createSlice({
  name: 'interfuerza',
  initialState: {
    interfuerza: [],
    status: 'idle',
    error: null,
    search: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interfuerza = action.payload.data;
      })

  },
});

export default interfuerzaSlice.reducer;
