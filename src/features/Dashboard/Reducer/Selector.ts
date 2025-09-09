import type { RootState } from "../../../store/store";

export const selectDashboardData = (state: RootState) =>
  state.DashboardSlice.data;
