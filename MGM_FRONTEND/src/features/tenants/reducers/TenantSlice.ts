import { createSlice } from '@reduxjs/toolkit';

const TenantSlice = createSlice({
	name: 'tenantSlice',
	initialState: {
		data: [],
		singleData: [],
	},
	reducers: {
		getAllTenantDetails: (state: any, action: any) => {
			state.data = action.payload;
		},
		getsingleTenantDetails: (state: any, action: any) => {
			state.singleData = action.payload;
		},
	},
});

export const { getAllTenantDetails, getsingleTenantDetails } =
	TenantSlice.actions;
export default TenantSlice.reducer;
