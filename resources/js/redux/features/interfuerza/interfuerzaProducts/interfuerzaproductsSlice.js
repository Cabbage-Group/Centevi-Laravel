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
        status: 'idle',
        error: null,
        page: 1,
        hasMore: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterfuerzaProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInterfuerzaProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('action:', action.payload)
                const { products, page } = action.payload;

                if (page === 1) {
                    state.interfuerzaProducts = products;
                } else {
                    state.interfuerzaProducts = [...state.interfuerzaProducts, ...products];
                }

                state.page = page;
                state.hasMore = products.length === 25;
            })


    },
});

export default interfuerzaProductsSlice.reducer;
