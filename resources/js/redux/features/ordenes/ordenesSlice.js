import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fecthOrdenes = createAsyncThunk(
    'ordenes/fecthordenes',
    async ({ page = 1, limit = 20, sortOrder = 'desc', sortColumn = 'created_at'}) => {
        const response = await axios.get(`${API}/ordenes`, {
            params: { page, limit, sortOrder, sortColumn}
        });
        return response.data;
    }
);

export const createOrdenes = createAsyncThunk(
    'ordenes/createOrdenes',
    async (data) => {
        try {
            const response = await axios.post(`${API}/ordenes`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating orden:', error.response.data);
            throw error;
        }
    }
);

export const deleteOrdenes = createAsyncThunk(
    'ordenes/deleteOrden',
    async (id_orden) => {
      try {
        await axios.delete(`${API}/ordenes/${id_orden}`);
        return id_orden;
      } catch (error) {
        console.error('Error deleting orden:', error.response.data);
        throw error;
      }
    }
  );


export const updateOrden = createAsyncThunk(
    'ordenes/updateOrdenes',
    async ({ id_orden, data }) => {
      try {      
        console.log('data:',data)
        const response = await axios.put(`${API}/ordenes/${id_orden}`, data);
  
        return response.data;
      } catch (error) {
        console.error('Error updating orden:', error.response?.data || error.message);
        throw error;
      }
    }
  );
  

const ordenesSlice = createSlice({
    name: 'ordenes',
    initialState: {
        data: [],
        ordenes: [],
        meta: {},
        status: 'idle',
        error: null,
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
            .addCase(fecthOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fecthOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ordenes = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fecthOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ordenes.push(action.payload.data);
            })
            .addCase(createOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateOrden.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOrden.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.ordenes.findIndex(receta => receta.id_orden === action.payload.data.id_orden);
                if (index !== -1) {
                  state.ordenes[index] = action.payload.data;
                }
            })
            .addCase(updateOrden.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteOrdenes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteOrdenes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ordenes = state.ordenes.filter(orden => orden.id_orden !== action.payload);
            })
            .addCase(deleteOrdenes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setOrden, setOrdenPor, setSearch } = ordenesSlice.actions;
export default ordenesSlice.reducer;
