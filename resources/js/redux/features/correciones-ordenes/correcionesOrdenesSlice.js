import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthCorrecionesOrdenes = createAsyncThunk(
    'correcionesordenes/fecthCorrecionesordenes',
    async ({
        page = 1,
        limit = 20,
        sortOrder = 'desc',
        sortColumn = 'created_at',
    }) => {
        const response = await axios.get(`${API}/correciones-ordenes`, {
            params: { page, limit, sortOrder, sortColumn },
        });
        return response.data;
    }
);

export const createCorrecionesOrdenes = createAsyncThunk(
    'correcionesordenes/createCorrecionesOrdenes',
    async (data) => {
        try {
            const response = await axios.post(`${API}/correciones-ordenes`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating orden:', error.response.data);
            throw error;
        }
    }
);

export const fetchCorreccionesByOrdenId = createAsyncThunk(
    'correcionesordenes/fetchCorreccionesByOrdenId',
    async (
        {
            orden_id,
            laboratorio,
            lenteContacto,
            fase,
            sucursales,
            estados,
            pagado
        }) => {
        try {
            const response = await axios.post(`${API}/obtener-correcciones-ordenes/${orden_id}`, {
                laboratorio,
                lenteContacto,
                fase,
                sucursales,
                estados,
                pagado
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching correcciones for orden:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const deleteCorreccionesOrdenes = createAsyncThunk(
    'correcionesordenes/deleteCorreccionesOrden',
    async (id_orden, { rejectWithValue }) => {
        try {
            console.log('id_orden:', id_orden);
            await axios.delete(`${API}/correciones-ordenes`, {
                data: { correccion_id: id_orden } // Enviar el objeto JSON en el cuerpo de la solicitud
            });
            return id_orden;
        } catch (error) {
            console.error('Error deleting orden:', error.response?.data);
            return rejectWithValue(error.response?.data || 'Error deleting correction');
        }
    }
);

export const updateCorreccionOrden = createAsyncThunk(
    'correcionesordenes/updateCorreccionesOrdenes',
    async ({ id, data }) => {
        try {
            console.log('data:', data)
            const response = await axios.put(`${API}/correciones-ordenes/${id}`, data);

            return response.data;
        } catch (error) {
            console.error('Error updating correccion orden:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const fetchContactoCorreccionesOrdenesDelPaciente = createAsyncThunk(
    'ordenes/fetchContactoOrdenesDelPaciente',
    async (id) => {
        const response = await axios.get(`${API}/correciones-ordenes/contacto-correccion-orden/${id}`);
        return response.data;
    }
);

export const verOrdenCorrecionPdf = createAsyncThunk(
    'ordenes-correciones/viewPdf',
    async (id_orden, { rejectWithValue }) => {
        let urlPdf = null
        try {
            const response = await axios.get(`${API}/correciones-ordenes/pdf/${id_orden}`, {
                responseType: 'blob',
            })
            console.log("response")
            console.log(response)
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            urlPdf = url
        } catch (error) {
            console.error('Error al visualizar la orden:', error.response?.data)
            return rejectWithValue(error.response?.data || 'Error al obtener PDF')
        }
        return urlPdf
    }
);

export const fetchCorreccionOrden = createAsyncThunk(
    'ordenes/fetchCorreccionOrden',
    async (id_correccion, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/obtener-correccion/${id_correccion}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);



const correcionesordenesSlice = createSlice({
    name: 'correcionesordenes',
    initialState: {
        correcionesordenes: [],
        correciones_ordenes_options_selecteds: [],
        correcionesbyOrden: [],
        contactoCorreccionOrden: [],
        correcionOrden: {},
        metabyOrden: {},
        meta: {},
        status: 'idle',
        statusCorreccionOrden: 'idle',
        error: null,
        errorCorreccionOrden: null,
        sortOrder: 'desc',
        sortColumn: 'created_at',
    },
    reducers: {
        setOrden(state, action) {
            state.sortOrder = action.payload;
        },
        setOrdenPor(state, action) {
            state.sortColumn = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthCorrecionesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fecthCorrecionesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.correcionesordenes = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fecthCorrecionesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createCorrecionesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCorrecionesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.correcionesordenes.push(action.payload.data);
            })
            .addCase(createCorrecionesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCorreccionesByOrdenId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCorreccionesByOrdenId.fulfilled, (state, action) => {
                state.loading = false;
                state.correcionesbyOrden = action.payload.data;
                state.metabyOrden = action.payload.meta
            })
            .addCase(fetchCorreccionesByOrdenId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCorreccionesOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCorreccionesOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.correcionesordenes = state.correcionesordenes.filter(orden => orden.id !== action.payload);
            })
            .addCase(deleteCorreccionesOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateCorreccionOrden.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCorreccionOrden.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.correcionesordenes.findIndex(receta => receta.id === action.payload.data.id);
                if (index !== -1) {
                    state.correcionesordenes[index] = action.payload.data;
                }
            })
            .addCase(updateCorreccionOrden.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchContactoCorreccionesOrdenesDelPaciente.fulfilled, (state, action) => {
                state.contactoCorreccionOrden = action.payload.data;
            })
            .addCase(fetchCorreccionOrden.pending, (state) => {
                state.statusCorreccionOrden = 'loading';
            })
            .addCase(fetchCorreccionOrden.fulfilled, (state, action) => {
                state.statusCorreccionOrden = 'succeeded';
                state.correcionOrden = action.payload.data;;
            })
            .addCase(fetchCorreccionOrden.rejected, (state, action) => {
                state.statusCorreccionOrden = 'failed';
                state.errorCorreccionOrden = action.error.message;
            });

    },
});

export const {
    setOrden,
    setOrdenPor
} = correcionesordenesSlice.actions;
export default correcionesordenesSlice.reducer;
