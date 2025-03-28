import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';


export const fetchProveedorMaterial = createAsyncThunk(
    'proveedorMaterial/fetchProveedorMaterial',
    async () => {
        try {
            const response = await axios.get(`${API}/proveedor-material`);
            return response.data;
        } catch (error) {

            console.error('Error fetching proveedor-material:', error.response.data);
            throw error;
        }
    }
);

export const createProveedorMaterial = createAsyncThunk(
    'proveedorMaterial/createProveedorMaterial',
    async (values) => {
        try {
            const response = await axios.post(`${API}/proveedor-material`, values);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data); 
            }
            throw error;
        }
    }
);

export const updateProveedorMaterial = createAsyncThunk(
    'proveedorMaterial/updateProveedorMaterial',
    async ({ id, ...values }) => {
        try {
            const response = await axios.put(`${API}/proveedor-material/${id}`, values);

            return response.data;
        } catch (error) {
            console.error('Error updating proveedor-material:', error.response?.data || error.message);
            throw error;
        }
    }
);

export const deleteProveedorMaterial = createAsyncThunk(
    'proveedorMaterial/deleteProveedorMaterial',
    async (id) => {
        try {
            await axios.delete(`${API}/proveedor-material/${id}`);
            return id;
        } catch (error) {
            console.error('Error deleting proveedor-material :', error.response.data);
            throw error;
        }
    }
);


const proveedorMaterialSlice = createSlice({
    name: 'proveedorMaterial',
    initialState: {
        proveedorMaterial: [],
        proveedor_material_options_selecteds: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProveedorMaterial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProveedorMaterial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.proveedorMaterial = action.payload.data;
                state.proveedor_material_options_selecteds = action.payload.data
                    .map(({ id, nombre }) => ({
                        value: nombre,
                        label: nombre
                    }));

            })
            .addCase(fetchProveedorMaterial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createProveedorMaterial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createProveedorMaterial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.proveedorMaterial.push(action.payload);
            })
            .addCase(createProveedorMaterial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateProveedorMaterial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProveedorMaterial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.proveedorMaterial.findIndex(proveedor => proveedor.id === action.payload.id);
                if (index !== -1) {
                    state.proveedorMaterial[index] = action.payload;
                }

            })
            .addCase(updateProveedorMaterial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteProveedorMaterial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteProveedorMaterial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.proveedorMaterial = state.proveedorMaterial.filter(proveedor => proveedor.id !== action.payload);
                state.proveedor_material_options_selecteds = state.proveedor_material_options_selecteds.filter(proveedor => proveedor.id !== action.payload);
            })
            .addCase(deleteProveedorMaterial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default proveedorMaterialSlice.reducer; 