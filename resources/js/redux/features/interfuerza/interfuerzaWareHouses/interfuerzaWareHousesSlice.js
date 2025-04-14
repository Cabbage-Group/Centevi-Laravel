import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../../../config/config';


export const fetchInterfuerzaWareHouses = createAsyncThunk(
    'interfuerzaWareHouses/fetchInterfuerzaWareHouses',
    async () => {
        try {

            const response = await axios.get(`${API}/ware-houses/get`);
            const wareHouses = response.data.data;
            return wareHouses
        } catch (error) {
            console.error('Error fetching interfuerza wareHouses:', error.response.data);
            throw error;
        }
    }
);

const interfuerzaWareHousesSlice = createSlice({
    name: 'interfuerzaWareHouses',
    initialState: {
        interfuerzaWareHouses: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterfuerzaWareHouses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInterfuerzaWareHouses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.interfuerzaWareHouses = action.payload;
            })


    },
});

export default interfuerzaWareHousesSlice.reducer;
