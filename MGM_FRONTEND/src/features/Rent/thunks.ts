import { getRentAll } from "./service";
import { getRents } from "./slice";

export const fetchRentThunk = (params: any) => async (dispatch: any) => {
  try {
    const response = await getRentAll(params);
    dispatch(getRents(response.data));
    console.log("Fetched FAQs:", response.data);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
  }
};