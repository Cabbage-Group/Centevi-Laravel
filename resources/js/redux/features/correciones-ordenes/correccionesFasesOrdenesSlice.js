import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthCorreccionesFasesOrdenes = createAsyncThunk(
    'correccionesFasesOrdenes/fecthcorreccionesFasesOrdenes',
    async () => {
        const response = await axios.get(`${API}/fases-correciones-ordenes`);

        return response.data;
    }
);

export const createCorreccionesFasesOrdenes = createAsyncThunk(
    'correccionesFasesOrdenes/createcorreccionesFasesOrdenes',
    async (data) => {
        try {
            const response = await axios.post(`${API}/create-fases-correciones-ordenes`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating fase  correccion orden:', error.response.data);
            throw error;
        }
    }
);

export const updateCorreccionesFasesOrdenes = createAsyncThunk(
    'correccionesFasesOrdenes/updatecorreccionesFasesOrdenes',
    async ({ id, data }) => {
        try {
            console.log('data:', data)
            const response = await axios.put(`${API}/fases-correciones-ordenes/${id}`, data);

            return response.data;
        } catch (error) {
            console.error('Error updating fase correccion orden:', error.response?.data || error.message);
            throw error;
        }
    }
);




const fasesCorrecionesOrdenesSlice = createSlice({
    name: 'correccionesFasesOrdenes',
    initialState: {
        fasesCorreccionesOrdenes: [],
        nuevaDataCorrecciones: [],
        pagado: [],
        laboratorio: [],
        tipoLente: [],
        fase: [],
        sucursal: [],
        statusOrden: [],
        fechaInicio: '',
        fechaFin: '',
        status: 'idle',
        error: null,
    },
    reducers: {
        actualizarDatosFaseCorrecciones: (state, action) => {
            state.nuevaDataCorrecciones = action.payload;
        },
        setPagadoFilter: (state, action) => {
            state.pagado = action.payload;
        },
        setLaboratorioFilter: (state, action) => {
            state.laboratorio = action.payload;
        },
        setTipoLenteFilter: (state, action) => {
            state.tipoLente = action.payload;
        },
        setFaseFilter: (state, action) => {
            state.fase = action.payload;
        },
        setSucursalFilter: (state, action) => {
            state.sucursal = action.payload;
        },
        setStatusFilter: (state, action) => {
            state.statusOrden = action.payload;
        },
        setFechaInicioFilter: (state, action) => {
            state.fechaInicio = action.payload;
        },
        setFechaFinFilter: (state, action) => {
            state.fechaFin = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthCorreccionesFasesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fecthCorreccionesFasesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fasesCorreccionesOrdenes = action.payload.data;
            })
            .addCase(fecthCorreccionesFasesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCorreccionesFasesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCorreccionesFasesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fasesCorreccionesOrdenes.push(action.payload.data);
            })
            .addCase(createCorreccionesFasesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateCorreccionesFasesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCorreccionesFasesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.fasesCorreccionesOrdenes.findIndex(receta => receta.id === action.payload.data.id);
                if (index !== -1) {
                    state.fasesCorreccionesOrdenes[index] = action.payload.data;
                }
            })
            .addCase(updateCorreccionesFasesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { 
    actualizarDatosFaseCorrecciones, 
    setPagadoFilter,
    setLaboratorioFilter,
    setTipoLenteFilter,
    setFaseFilter,
    setSucursalFilter,
    setStatusFilter,
    setFechaInicioFilter,
    setFechaFinFilter
 } = fasesCorrecionesOrdenesSlice.actions;

export default fasesCorrecionesOrdenesSlice.reducer;
