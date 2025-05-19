import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../config/config';

export const fetchProductsInterfuerza = createAsyncThunk(
    'productsInterfuerza/fetchProductsInterfuerza',
    async ({
        page,
        limit,
        search,
        sortColumn = 'id',
        sortOrder = 'asc',
        filter
    }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API}/products`, {
                params: {
                    page,
                    limit,
                    sortColumn,
                    sortOrder,
                    search,
                    filter

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

export const migrationProductsInterfuerza = createAsyncThunk(
    'productsInterfuerza/migrationProductsInterfuerza',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API}/migration/products`, data);
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


const productsInterfuerzaSlice = createSlice({
    name: 'productsInterfuerza',
    initialState: {
        productsInterfuerza: [],
        page: 1,
        limit: 25,
        sortColumn: 'id',
        sortOrder: 'asc',
        total: 0,
        inserted: 0,
        searchTerm: '',
        status: 'idle',
        status_migration: 'idle',
        error_migration: null,
        error: null,
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSort: (state, action) => {
            state.sortColumn = action.payload.sortColumn;
            state.sortOrder = action.payload.sortOrder;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.page = 1;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsInterfuerza.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsInterfuerza.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.productsInterfuerza = action.payload.data;
                state.meta = action.payload.meta
            })
            .addCase(fetchProductsInterfuerza.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(migrationProductsInterfuerza.pending, (state) => {
                state.status_migration = 'loading';
            })
            .addCase(migrationProductsInterfuerza.fulfilled, (state, action) => {
                state.status_migration = 'succeeded';
                state.inserted = action.payload.inserted;
                const migratedProducts = action.payload.migrated_products;

                if (migratedProducts && migratedProducts.length > 0) {
                    state.productsInterfuerza = [...state.productsInterfuerza, ...migratedProducts];
                }
            }) 
            .addCase(migrationProductsInterfuerza.rejected, (state, action) => {
                state.status_migration = 'failed';
                state.error_migration = action.error.message;
            })
},
});


export const { setPage, setSort, setSearchTerm } = productsInterfuerzaSlice.actions;
export default productsInterfuerzaSlice.reducer;

