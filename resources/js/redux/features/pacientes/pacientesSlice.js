// redux/slices/pacientesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchPacientes = createAsyncThunk(
  'pacientes/fetchPacientes',
  async ({
    page = 1, limit = 50000, sortOrder = 'asc', sortColumn = 'nombres',
    search = '', doctor = null
  }) => {

    const params = { page, limit, sortOrder, sortColumn, search };

    if (doctor) {
      params.doctor = doctor;
    }

    const response = await axios.get(`${API}/pacientes`, { params });
    return response.data;
  }
);

export const fetchPacientesMenciones = createAsyncThunk(
  'pacientes/fetchPacientesMenciones',
  async ({ search = '' }) => {

    const response = await axios.get(`${API}/menciones/pacientes`, {
      params: { search }
    });
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

export const fetchInterfuerza = createAsyncThunk(
  'pacientes/fetchInterfuerza',
  async ({ ruc, usuario }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/verificar-interfuerza`, { ruc, usuario });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Error desconocido' });
      }
    }
  }
);




const pacientesSlice = createSlice({
  name: 'pacientes',
  initialState: {
    data: [],
    pacientes: [],
    pacientes_options_selecteds: [],
    pacientes_options_agenda: [],
    pacientes_menciones: [],
    meta: {},
    status: 'idle',
    statusInterfuerza: 'idle',
    errorInterfaz: null,
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
        state.pacientes_options_agenda = action.payload.data.map(({ id_paciente, nro_cedula, nombres, apellidos, ...rest }) =>
          id_paciente && nombres && apellidos && nro_cedula ?
            {
              value: id_paciente,
              label: `${nro_cedula}-${nombres} ${apellidos}`,
              nombres: nombres,
              apellidos: apellidos,
              nro_cedula: nro_cedula,
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
      })
      .addCase(fetchPacientesMenciones.fulfilled, (state, action) => {
        state.pacientes_menciones = action.payload.data;
      })
      .addCase(fetchInterfuerza.pending, (state) => {
        state.statusInterfuerza = 'loading';
      })
      .addCase(fetchInterfuerza.fulfilled, (state, action) => {
        state.statusInterfuerza = 'succeeded';

      })
      .addCase(fetchInterfuerza.rejected, (state, action) => {
        console.log(' action:', action)
        state.statusInterfuerza = 'failed';
        state.errorInterfaz = action.error.message;
      });
  },
});

export default pacientesSlice.reducer;

