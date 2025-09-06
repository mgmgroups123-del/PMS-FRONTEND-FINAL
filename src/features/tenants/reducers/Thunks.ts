import { getAllTenants, getTenantsById } from '../services';
import { getAllTenantDetails, getsingleTenantDetails } from './TenantSlice';

export const getAllTenantData = (data: any) => async (dispatch: any) => {
	try {
		const response = await getAllTenants(data);
		if (response) {
			dispatch(getAllTenantDetails(response));
			return response;
		}
	} catch (error) {
		console.log(error);
	}
};

export const getSingleTenantData = (data: any) => async (dispatch: any) => {
	try {
		const response = await getTenantsById(data);
		if (response) {
			dispatch(getsingleTenantDetails(response));
		}
	} catch (error) {
		console.log(error);
	}
};
