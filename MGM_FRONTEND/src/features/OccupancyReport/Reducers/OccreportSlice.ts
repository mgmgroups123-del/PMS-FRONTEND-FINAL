import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OccReportState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: OccReportState = {
  data: null,
  loading: false,
  error: null,
};

const occReportSlice = createSlice({
  name: "occReport",
  initialState,
  reducers: {
    setOccReport: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setOccReport, setLoading, setError } = occReportSlice.actions;
export default occReportSlice.reducer;
