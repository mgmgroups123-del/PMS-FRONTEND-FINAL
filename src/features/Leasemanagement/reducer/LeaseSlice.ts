import { createSlice } from '@reduxjs/toolkit';

const LeasemanagementSlice = createSlice({
    name: 'LeasemanagementSlice',
    initialState: {
        data: [],
        data2:[],
    },
    reducers: {
        getLeasemanagement: (state, action) => {
            state.data = action.payload;
        },
       getLeaseIdDetails: (state, action) => {
    state.data2 = action.payload;
},

    },
});

export const { getLeasemanagement,getLeaseIdDetails } = LeasemanagementSlice.actions;
export default LeasemanagementSlice.reducer;
