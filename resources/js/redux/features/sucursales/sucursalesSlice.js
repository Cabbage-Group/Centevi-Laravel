import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config.js';

export const fetchSucursales = createAsyncThunk(
    'sucursales/fetchSucursales',
    async ({ page = 1, limit = 50, sortOrder = 'asc', sortColumn = 'nombre', search = '' }) => {
        try {
            const response = await axios.get(`${API}/sucursales`, {
                params: { page, limit, sortOrder, sortColumn, search }
            });
            return response.data;
        } catch (error) {
            
            console.error('Error fetching sucursales:', error.response.data);
            throw error;
        }
    }
);

export const createSucursal = createAsyncThunk(
    'sucursales/createSucursal',
    async (newSucursalData) => {
        try {
            const response = await axios.post(`${API}/sucursales`, newSucursalData);
            return response.data;  
        } catch (error) {
            console.error('Error creating usuario:', error.response.data);
            throw error;
        }
    }
);

export const updateSucursal = createAsyncThunk(
    'sucursales/updateSucursal',
    async ({ id, updatedData }) => {
        try {
            console.log('id:',id)
            const response = await axios.put(`${API}/sucursales/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating sucursal:', error.response.data);
            throw error;
        }
    }
);

export const deleteSucursal = createAsyncThunk(
    'sucursales/deleteSucursal',
    async (id) => {
        try {
            await axios.delete(`${API}/sucursales/${id}`);
            return id; 
        } catch (error) {
            console.error('Error deleting usuario:', error.response.data);
            throw error;
        }
    }
);




const sucursalesSlice = createSlice({
    name: 'sucursales',
    initialState: {
        sucursales: [],
        metaSucursales: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSucursales.pending, (state) => {
                state.status = 'loading';
                state.metaSucursales = {};
            })
            .addCase(fetchSucursales.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sucursales = action.payload.data;
                state.metaSucursales = action.payload.meta;
            })
            .addCase(fetchSucursales.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateSucursal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateSucursal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.sucursales.findIndex(sucursal => sucursal.id_sucursal === action.payload.data.id_sucursal);
                if (index !== -1) {
                    state.sucursales[index] = action.payload.data;
                }
            })
            .addCase(updateSucursal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
            
    },
});

export default sucursalesSlice.reducer;