import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';


export const fetchInterfuerzaCustomers = createAsyncThunk(
    'interfuerzaCustomers/fetchInterfuerzaCustomers',
    async ({ page = 1, field, operator, value }) => {
        try {
            const response = await axios.get(`${API}/customers/get`,
                {
                    params: {
                        page: page,
                        field: field,
                        operator: operator,
                        value: value
                    }
                });
            const customers = response.data.data;
            return { customers, page };
        } catch (error) {
            console.error('Error fetching interfuerza Customers:', error.response.data);
            throw error;
        }
    }
);

const interfuerzaCustomersSlice = createSlice({
    name: 'interfuerzaCustomers',
    initialState: {
        interfuerzaCustomers: [],
        status: 'idle',
        error: null,
        page: 1,
        hasMore: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterfuerzaCustomers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInterfuerzaCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('action:', action.payload)
                const { customers, page } = action.payload;

                if (page === 1) {
                    state.interfuerzaCustomers = customers;
                } else {
                    state.interfuerzaCustomers = [...state.interfuerzaCustomers, ...customers];
                }

                state.page = page;
                state.hasMore = customers.length === 25;
            })


    },
});

export default interfuerzaCustomersSlice.reducer;
