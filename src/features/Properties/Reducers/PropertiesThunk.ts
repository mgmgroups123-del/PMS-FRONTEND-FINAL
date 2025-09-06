import { createProperty, createUnit, deleteProperty, editProperty, getAllProperties, GetunitPropertyID, updatePropertyId } from "../Services/index"
import { setProperty, setLoading, setError, addProperty, updateProperty, removeProperty, addUnit, setUnits, updateUnit } from "./PropertiesSlice"

//Get All Property
export const fetchGetProperties = (params?: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    const res = await getAllProperties(params)
    dispatch(setProperty(res?.data))
  } catch (error) {
    console.log("Error fetching properties:", error)
    dispatch(setError("Failed to fetch properties"))
  }
}

// CREATE Property
export const fetchCreateProperty = (data: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    const res = await createProperty(data)
    dispatch(addProperty(res?.data))
  } catch (error) {
    console.log("Error creating property:", error)
    dispatch(setError("Failed to create property"))
  }
}

// EDIT Property
export const fetchEditProperty =
  (params: any, updatedData: any) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const res = await editProperty(params, updatedData); 
      dispatch(updateProperty(res)); 
    } catch (error) {
      console.log("Error editing property:", error);
      dispatch(setError("Failed to edit property"));
    }
  };

//Delete Property
export const fetchDeleteProperty = (uuid: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    await deleteProperty({uuid}); 
    dispatch(removeProperty(uuid)); 
  } catch (error) {
    console.log("Error deleting property:", error);
    dispatch(setError("Failed to delete property"));
  }
};

//Create Unit 
export const fetchCreateUnit = (data: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const res = await createUnit(data);
    dispatch(addUnit(res?.data));
  } catch (error) {
    console.log("Error creating unit:", error);
    dispatch(setError("Failed to create unit"));
  }
};

// Get Units by Property ID
export const fetchUnitsByPropertyId = (propertyId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const res = await GetunitPropertyID(propertyId);  
    console.log("Unit :",res)
    dispatch(setUnits(res || []));
  } catch (error) {
    console.log("Error fetching units:", error);
    dispatch(setError("Failed to fetch units"));
  }
};

// update Unites
export const fetchUpdateUnit = (uuid: string, data: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const res = await updatePropertyId(uuid, data);
    dispatch(updateUnit(res.data));
    return res;
  } catch (error) {
    console.log("Error updating unit:", error);
    dispatch(setError("Failed to update unit"));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};