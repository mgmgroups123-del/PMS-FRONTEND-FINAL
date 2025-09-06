import Client from "../../../api"; 

export const getProfileData = async () => {
  const response = await Client.auth.me();
  if (response) {
    return response;
  }
};
export const updateProfileData = async (uuid: string, data: any) => {
  try {
    const response = await Client.auth.update_profile({ uuid, ...data });
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
export const updatePassword = async ( data: any) => {
  try {
    const response = await Client.auth.update_password({  ...data });
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};


  export const getallactivity = async ( data: any) => {
    try{
      const response = await Client.auth.activity(data)
  if (response) {
    return response;
  }
}
catch(err){
  console.log(err,'error')
}
};
