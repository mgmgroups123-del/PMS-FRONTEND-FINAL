
import type { AppDispatch } from "../../../store/store"; 
import { fetchOccReport } from "../Service";
import { setError, setLoading, setOccReport } from "./OccreportSlice";

// Manual thunk
export const loadOccReport = (params?: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const res = await fetchOccReport(params);
    dispatch(setOccReport(res));
  } catch (err: any) {
    dispatch(setError(err.message || "Something went wrong"));
  }
};
