import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';


export const fetchTiposAros = createAsyncThunk(
  'tiposAros/fetchTiposAros',
  async () => {
    try {
      const response = await axios.get(`${API}/tipos-aros`);
      return response.data;
    } catch (error) {

      console.error('Error fetching tipos-aros:', error.response.data);
      throw error;
    }
  }
);

export const createTiposAros = createAsyncThunk(
  'tiposAros/createTiposAros',
  async (values) => {
    try {
      const response = await axios.post(`${API}/tipos-aros`, values);
      return response.data;
    } catch (error) {

      console.error('Error creating tipos-aros:', error.response.data);
      throw error;
    }
  }
);

export const updateTiposAros = createAsyncThunk(
  'tiposAros/updateTiposAros',
  async ({ id, ...values }) => {
    try {
      const response = await axios.put(`${API}/tipos-aros/${id}`, values);

      return response.data;
    } catch (error) {
      console.error('Error updating tipos-aros:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteTiposAros = createAsyncThunk(
  'tiposAros/deleteTiposAros',
  async (id) => {
    try {
      await axios.delete(`${API}/tipos-aros/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting tipos-aros :', error.response.data);
      throw error;
    }
  }
);


const tiposArosSlice = createSlice({
  name: 'tiposAros',
  initialState: {
    tiposAros: [],
    tipo_aro_options_selecteds: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposAros.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTiposAros.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposAros = action.payload.data;
        state.tipo_aro_options_selecteds = action.payload.data
          .filter(({ id,nombre }) => id  && nombre)
          .map(({ id, nombre, ...rest }) => ({
            value: id,
            label: `${nombre}`,
            ...rest
          }));

      })
      .addCase(fetchTiposAros.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTiposAros.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTiposAros.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposAros.push(action.payload.data);
      })
      .addCase(createTiposAros.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTiposAros.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTiposAros.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.tiposAros.findIndex(tipoAro => tipoAro.id === action.payload.data.id);
        if (index !== -1) {
          state.tiposAros[index] = action.payload.data;
        }
                         
      })
      .addCase(updateTiposAros.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTiposAros.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTiposAros.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tiposAros = state.tiposAros.filter(tipoAro => tipoAro.id !== action.payload);
        state.tipo_aro_options_selecteds = state.tipo_aro_options_selecteds.filter(tipoAro => tipoAro.id !== action.payload);
      })
      .addCase(deleteTiposAros.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default tiposArosSlice.reducer; 