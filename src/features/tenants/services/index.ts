import Client from '../../../api/index';

export const getAllTenants = async (data: any) => {
	const response = await Client.tenant.getAll(data);
	if (response) return response;
};

export const getTenantsById = async (params: any) => {
	const response = await Client.tenant.getByid(params);
	if (response) return response;
};

export const createTenants = async (params: any) => {
	const response = await Client.tenant.create(params);
	if (response) return response;
};

export const deleteTenants = async (params: any) => {
	const response = await Client.tenant.delete(params);
	if (response) return response;
};

export const editTenants = async (data: any) => {
	const response = await Client.tenant.edit(data);
	if (response) return response;
};

export const getPropertyData = async (data: any) => {
	const response = await Client.property.getProperty(data);
	if (response) return response;
};

export const getPropertyByIdData = async (params: any) => {
	const response = await Client.property.getByid(params);
	if (response) return response;
};
