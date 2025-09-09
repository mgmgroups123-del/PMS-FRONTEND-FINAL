import { getAllLeasemanagement, getLeaseDetailsId } from '../services/Leasemanagement';
import {  getLeaseIdDetails, getLeasemanagement } from '../reducer/LeaseSlice';

export const getAllLeasemanagementThunk =
    (params: any) => async (dispatch: any) => {
        try {
            const response = await getAllLeasemanagement(params);
            console.log(response, "Notification Datas")
            dispatch(getLeasemanagement(response.data));
        } catch (error) {
            console.log(error);
        }
    };
    export const getLeaseIdDetail = (params: any) => async(dispatch:any) => {
    try{
        const response = await getLeaseDetailsId(params);
        console.log('classIddetails :', response);
        dispatch(getLeaseIdDetails(response))
    }
    catch(error){
        console.log(error);
        
    }
}
