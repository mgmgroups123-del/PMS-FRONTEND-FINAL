import {AllMaintenance, AllProperty, AllUnits, CreatMaintenance} from "../services/index.ts"
import  {creatMaintenance, getAllMaintenance, getproperty, getunit} from "./moduleSlice.ts" 

export const GetallMaintenanceThunks = (params: any) => async (dispatch: any) => {
  try {
    const response = await AllMaintenance(params);
    dispatch( getAllMaintenance(response.data));
    // console.log(response.data, "Maintenance in thunks");
    return response.data
  } catch (error) {
    console.log("error in thunks", error);
  }
};

export const CreatMaintenanceThunks = (params: any) => async (dispatch: any) => {
  try {
    const response = await CreatMaintenance(params);
    dispatch( creatMaintenance(response?.data || response || []));
    // console.log(response.data, "Maintenance in thunks");
    return response
  } catch (error) {
    console.log("error in thunks", error);
  }
};

export const GetallPropertyThunks = (params: any) => async (dispatch: any) => {
  try {
    const response = await AllProperty(params);
    // console.log(response, "Property  in thunks");
    dispatch( getproperty(response));
    return response
  } catch (error) {
    console.log("Property error in thunks", error);
  }
};

export const GetallUnitThunks = (params: any) => async (dispatch: any) => {
  try {
    const response = await AllUnits(params); 
    console.log(response, "Unit in thunks");
    dispatch(getunit(response));
    return response;
  } catch (error) {
    console.error("Unit error in thunks", error);
  }
};


