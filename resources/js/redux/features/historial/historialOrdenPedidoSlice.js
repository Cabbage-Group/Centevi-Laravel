import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchHistorialOrden = createAsyncThunk(
    'historialOrdenPedido/fetchHistorialOrden',
    async ({ idOrden, esCorreccion = false, correccionId = null }) => {
        try {
            const response = await axios.get(`${API}/pedidos/historial/${idOrden}`, {
                params: {
                    es_correccion: esCorreccion ? 1 : 0,
                    correccion_id: correccionId,
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);


export const eliminarHistorialOrden = createAsyncThunk(
    'historialOrdenPedido/eliminarHistorialOrden',
    async ({ tipo, id }, { rejectWithValue }) => {
        try {
            await axios.delete(`${API}/pedidos/evento`, {
                data: { tipo, id }
            });
            return { tipo, id };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const historialOrdenSlice = createSlice({
    name: 'historialOrdenPedido',
    initialState: {
        historial: [],
        meta: {},
        status: 'idle',
        deleteStatus: 'idle',
        error: null,
    },
    reducers: {
        clearHistorial(state) {
            state.historial = [];
            state.meta = {};
            state.status = 'idle';
            state.deleteStatus = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistorialOrden.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchHistorialOrden.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.historial = action.payload.historial;
                state.meta = {
                    orden: action.payload.orden,
                    merma_total: action.payload.merma_total,
                    merma_pendiente: action.payload.merma_pendiente,
                    ultimo_proveedor: action.payload.ultimo_proveedor,
                };
            })
            .addCase(fetchHistorialOrden.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message ?? action.error.message;
            })

            .addCase(eliminarHistorialOrden.pending, (state) => {
                state.deleteStatus = 'loading';
                state.error = null;
            })
            .addCase(eliminarHistorialOrden.fulfilled, (state, action) => {
                const { tipo, id } = action.payload;
                state.deleteStatus = 'succeeded';
                state.historial = state.historial.filter((h) => {
                    if (tipo === 'pedido') {
                        return !(h.evento === 'PEDIDO' && h.evento_id === id);
                    } else {
                        return !(h.evento === 'MERMA' && h.evento_id === id);
                    }
                });
            })
            .addCase(eliminarHistorialOrden.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.error = action.payload?.message ?? action.error.message;
            });
    },
});

export const { clearHistorial } = historialOrdenSlice.actions;
export default historialOrdenSlice.reducer;