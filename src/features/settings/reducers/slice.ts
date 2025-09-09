import { createSlice } from "@reduxjs/toolkit";

const SettingsProfileSlice = createSlice({
    name: "profile",
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    reducers: {
        setProfile: (state, action) => {
            state.data = action.payload;
        },
        setProfileLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProfileError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setProfile, setProfileLoading, setProfileError } = SettingsProfileSlice.actions;
export default SettingsProfileSlice.reducer;
