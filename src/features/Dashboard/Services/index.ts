import Client from "../../../api/index";

export const Dashboardservice = async (data?: any) => {
  try {
    const res = await Client.dashboard.get(data);
    // console.log("databoard data:", res);
    return res;
  } catch (error) {
    console.log("Error for dashboard:", error);
  }
};

export const Globalsearchservice = async (data?: any) => {
  try {
    const res = await Client.dashboard.getGlobal(data);
    return res;
  } catch (error) {
    console.log("Error for dashboard:", error);
  }
};