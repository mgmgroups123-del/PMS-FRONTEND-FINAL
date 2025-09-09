import Client from "../../../api/index";

export const AllMaintenance = async (params: any) => {
  const response = await Client.maintenance.getAll(params);
//   console.log("Maintenance data getting", response);
  if (response) {
    return response;
  }
};

export const CreatMaintenance = async (params: any) => {
  const response = await Client.maintenance.create(params);
  console.log("data crated successfully", response);
  if (response) {
    return response?.data || {};
  }
};

export const AllProperty = async (params: any) => {
  const response = await Client.property.getProperty(params);
  console.log("Proprty data getting", response);
  if (response) {
    return response?.data;
  }
};

export const AllUnits = async (params: any) => {
  try {
    const response = await Client.property.getByid(params);
    console.log("UNIT data getting", response);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching units", error);
    return [];
  }
};