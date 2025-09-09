import Client from '../../../api/index';


export const loginService = async (params: { email: string; password: string }) => {
  try {
    const response = await Client.auth.login(params);
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message || "Login failed");
  }
};
