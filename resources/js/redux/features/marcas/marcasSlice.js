import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';


export const fetchMarcas = createAsyncThunk(
  'marcas/fetchMarcas',
  async () => {
    try {
      const response = await axios.get(`${API}/marcas`);
      return response.data;
    } catch (error) {

      console.error('Error fetching marcas:', error.response.data);
      throw error;
    }
  }
);

export const createMarcas = createAsyncThunk(
  'marcas/createMarcas',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/marcas`, values);
      return response.data;
    } catch (error) {
      console.error('Error creating marcas:', error.response.data);
      return rejectWithValue(error.response.data); 
    }
  }
);

export const updateMarcas = createAsyncThunk(
  'marcas/updateMarcas',
  async ({ id, ...values }) => {
    try {
      const response = await axios.put(`${API}/marcas/${id}`, values);

      return response.data;
    } catch (error) {
      console.error('Error updating marcas:', error.response?.data || error.message);
      throw error;
    }
  }
);

export const deleteMarcas = createAsyncThunk(
  'marcas/deleteMarcas',
  async (id) => {
    try {
      await axios.delete(`${API}/marcas/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting marcas :', error.response.data);
      throw error;
    }
  }
);


const marcasSlice = createSlice({
  name: 'marcas',
  initialState: {
    marcas: [],
    marcas_options_selecteds: [],
    marcas_lente_normal_options_selecteds: [],
    marcas_lente_contacto: [],
    marcas_lente_normal: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarcas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMarcas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.marcas = action.payload.data;
        state.marcas_lente_contacto = action.payload.data
          .filter(({ id, codigo, nombre, lente_contacto }) => id && codigo && nombre && lente_contacto === 1)

        state.marcas_lente_normal = action.payload.data
          .filter(({ id, codigo, nombre, lente_contacto }) => id && codigo && nombre && lente_contacto === 0)

        state.marcas_options_selecteds = action.payload.data
          .filter(({ id, codigo, nombre, lente_contacto }) => id && codigo && nombre && lente_contacto === 1)
          .map(({ id, codigo, nombre, ...rest }) => ({
            value: id,
            label: `${codigo} | ${nombre}`,
            ...rest
          }));
        state.marcas_lente_normal_options_selecteds = action.payload.data
          .filter(({ id, codigo, nombre, lente_contacto }) => id && codigo && nombre && lente_contacto === 0)
          .map(({ id, codigo, nombre, ...rest }) => ({
            value: id,
            label: `${codigo} | ${nombre}`,
            ...rest
          }));

      })
      .addCase(fetchMarcas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createMarcas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMarcas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.marcas.push(action.payload.data);
        if (action.payload.data.lente_contacto === 1) {
          state.marcas_lente_contacto.push(action.payload.data);
        } else if (action.payload.data.lente_contacto === 0) {
          state.marcas_lente_normal.push(action.payload.data);
        }
      })
      .addCase(createMarcas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateMarcas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMarcas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.marcas.findIndex(marca => marca.id === action.payload.data.id);
        if (index !== -1) {
          state.marcas[index] = action.payload.data;
        }

        const indexLenteContacto = state.marcas_lente_contacto.findIndex(marca => marca.id === action.payload.data.id);
        if (indexLenteContacto !== -1) {
          state.marcas_lente_contacto[indexLenteContacto] = action.payload.data;
        }
        const indexLenteNormal = state.marcas_lente_normal.findIndex(marca => marca.id === action.payload.data.id);
        if (indexLenteNormal !== -1) {  // Cambié indexLenteContacto por indexLenteNormal
          state.marcas_lente_normal[indexLenteNormal] = action.payload.data;
        }


        // if (index !== -1) {

        //     state.marcas[index] = updatedMarca;
        //     console.log('updatedMarca',updatedMarca)

        //     if (updatedMarca.lente_contacto === 1) {
        //         console.log('updatedMarca.lente_contacto11',updatedMarca.lente_contacto)

        //         state.marcas_lente_contacto = state.marcas_lente_contacto.filter(marca => marca.id === updatedMarca.id);

        //     } else if (updatedMarca.lente_contacto === 0) {
        //         console.log('updatedMarca.lente_contacto222',updatedMarca.lente_contacto)

        //         state.marcas_lente_contacto = state.marcas_lente_contacto.filter(marca => marca.id === updatedMarca.id);

        //     }
        // }                               
      })
      .addCase(updateMarcas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteMarcas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMarcas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.marcas = state.marcas.filter(marca => marca.id !== action.payload);
        state.marcas_lente_contacto = state.marcas_lente_contacto.filter(marca => marca.id !== action.payload);
        state.marcas_lente_normal = state.marcas_lente_normal.filter(marca => marca.id !== action.payload);
      })
      .addCase(deleteMarcas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default marcasSlice.reducer; 