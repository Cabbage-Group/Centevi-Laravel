// redux/slices/pacientesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchPacientes = createAsyncThunk(
  'pacientes/fetchPacientes',
  async ({ page = 1, limit = 10000, sortOrder = 'asc', sortColumn = 'nombres', search = '', doctor = null }) => {

    const params = { page, limit, sortOrder, sortColumn };

    if (doctor) {
      params.doctor = doctor;
    }

    const response = await axios.get(`${API}/pacientes`, {params});
    return response.data;
  }
);

export const eliminarPaciente = createAsyncThunk(
  'pacientes/eliminarPaciente',
  async (id_paciente) => {
    const response = await axios.delete(`${API}/pacientes/${id_paciente}`);
    return response.data;
  }
);

const pacientesSlice = createSlice({
  name: 'pacientes',
  initialState: {
    data: [],
    pacientes: [],
    pacientes_options_selecteds: [],
    meta: {},
    status: 'idle',
    error: null,
    search: '',
    doctor: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPacientes.pending, (state) => {
        state.status = 'loading';
        state.pacientes = [];
        state.meta = {};
      })
      .addCase(fetchPacientes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pacientes = action.payload.data;
        state.meta = action.payload.meta;

        state.pacientes_options_selecteds = action.payload.data.map(({ id_paciente, nro_cedula, nombres, apellidos, ...rest }) =>
          id_paciente && nombres && apellidos && nro_cedula ?
            {
              value: id_paciente,
              label: `Numero Cedula: ${nro_cedula} || Nombres: ${nombres} ${apellidos}`,
              ...rest
            } :
            { ...rest }
        );
      })
      .addCase(fetchPacientes.rejected, (state, action) => {
        state.status = 'failed';
        state.data = [];
        state.pacientes = [];
        state.pacientes_options_selecteds = [];
        state.error = action.error.message;

      })
      .addCase(eliminarPaciente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(eliminarPaciente.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Elimina el paciente del estado local
        state.pacientes = state.pacientes.filter(paciente => paciente.id !== action.meta.arg);
      })
      .addCase(eliminarPaciente.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.data = [];
        state.pacientes = [];
        state.pacientes_options_selecteds = [];
      });
  },
});

export default pacientesSlice.reducer;
