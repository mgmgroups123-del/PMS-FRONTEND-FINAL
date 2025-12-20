import { getProfileData } from "../../../features/settings/service";
import { setProfile, setProfileLoading, setProfileError } from "../reducers/slice";

// Fetch profile details
export const getProfileThunk = () => async (dispatch: any) => {
    try {
        dispatch(setProfileLoading(true));
        const response = await getProfileData();
        dispatch(setProfile(response?.data)); // adjust if API shape differs
        return response;
    } catch (error) {
        dispatch(setProfileError(error));
        console.error(error);
    } finally {
        dispatch(setProfileLoading(false));
    }
};