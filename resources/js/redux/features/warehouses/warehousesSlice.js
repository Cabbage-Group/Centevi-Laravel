import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchWareHouses = createAsyncThunk(
    'warehouses/fetchWareHouses',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/warehouses/index`, {
                params: {
                    page,
                    limit
                },
            });
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

export const syncWarehouses = createAsyncThunk(
    'warehouses/syncWarehouses',
    async () => {
        try {
            const response = await axios.post(`${API}/warehouses/sync`);
            console.log('response', response);
            return response.data.success;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({ message: 'Error desconocido' });
            }

        }

    }
)

export const updateSendDiscount = createAsyncThunk(
    'warehouses/updateSendDiscount',
    async ({ id, send_discount }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API}/warehouses/${id}/send-discount`, {
                send_discount,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error desconocido' });
        }
    }
);


const warehousesSlice = createSlice({
    name: 'warehouses',
    initialState: {
        warehouses: [],
        page: 1,
        limit: 18,
        total: 0,
        status: 'idle',
        meta: {},
        error: null,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWareHouses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWareHouses.fulfilled, (state, action) => {
                console.log('action.payload', action.payload);
                state.status = 'succeeded';
                state.warehouses = action.payload.data;
                state.meta = action.payload.meta
            })
            .addCase(fetchWareHouses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(syncWarehouses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(syncWarehouses.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(syncWarehouses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateSendDiscount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateSendDiscount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload.data;
                state.warehouses = state.warehouses.map((w) =>
                    w.id === updated.id ? updated : w
                );
            })
            .addCase(updateSendDiscount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

    },
});

export const { setPage } = warehousesSlice.actions;
export default warehousesSlice.reducer;

