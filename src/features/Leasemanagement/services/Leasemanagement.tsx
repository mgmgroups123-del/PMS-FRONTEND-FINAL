import Client from '../../../api/index';

export const getAllLeasemanagement= async (params:any) => {
    const response = await Client.lease.getAll(params);
    if (response) {
        return response;
    }
};
export const getLeaseDetailsId= async (params:any) => {
    const response = await Client.lease.getByid(params)
    if (response) {
        return response;
    }
};