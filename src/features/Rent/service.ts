import Client from '../../api/index'

export const getRentAll = async (params: any) => {
  try {
    const response = await Client.rent.getAll(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



export const downloadRent = async (uuid: string) => {
  try {
    const response = await Client.rent.download(uuid);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const updateRent = async (params: any) => {
  try {
    const response = await Client.rent.update(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const deleteRent = async (params: any) => {
  try {
    const response = await Client.rent.delete(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const downloadRentExcel = async () => {
  try {
    const response = await Client.rent.downloadExcel();
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const downloadAllRentPdf = async (params:any) => {
  try {
    const response = await Client.rent.downloadPdf(params);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

