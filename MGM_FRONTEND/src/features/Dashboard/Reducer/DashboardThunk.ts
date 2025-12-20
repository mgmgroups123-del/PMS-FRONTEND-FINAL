import type { AppDispatch } from "../../../store/store";
import { Dashboardservice } from "../Services";
import { dashboarddata } from "./DashboardSlice";

export const DashboardThunks =
  (data?: any) => async (dispatch: AppDispatch) => {
    try {
      const res = await Dashboardservice(data);
      // console.log("dashboard response:", res);
      dispatch(dashboarddata(res.data));
    } catch (error) {
      console.log("Error on thunk", error);
      throw error;
    }
  };
