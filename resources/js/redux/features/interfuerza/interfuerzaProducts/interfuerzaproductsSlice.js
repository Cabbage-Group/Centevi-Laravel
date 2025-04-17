import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';


export const fetchInterfuerzaProducts = createAsyncThunk(
    'interfuerzaProducts/fetchInterfuerzaProducts',
    async ({ page = 1, field, operator, value }) => {
        try {
            const response = await axios.get(`${API}/products/get`,
                {
                    params: {
                        page: page,
                        field: field,
                        operator: operator,
                        value: value
                    }
                });
            const products = response.data.data;
            return { products, page };
        } catch (error) {
            console.error('Error fetching interfuerza products:', error.response.data);
            throw error;
        }
    }
);

const interfuerzaProductsSlice = createSlice({
    name: 'interfuerzaProducts',
    initialState: {
        interfuerzaProducts: [],
        status_products: 'idle',
        error_products: null,
        page_products: 1,
        hasMore_products: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterfuerzaProducts.pending, (state) => {
                state.status_products = 'loading';
            })
            .addCase(fetchInterfuerzaProducts.fulfilled, (state, action) => {
                state.status_products = 'succeeded';
                console.log('action:', action.payload)
                const { products, page } = action.payload;

                if (page === 1) {
                    state.interfuerzaProducts = products;
                } else {
                    state.interfuerzaProducts = [...state.interfuerzaProducts, ...products];
                }

                state.page_products = page;
                state.hasMore_products = products.length === 25;
            })


    },
});

export default interfuerzaProductsSlice.reducer;
