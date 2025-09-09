import type { RootState } from "../../../store/store";
export const selectOccReport = (state: RootState) => state.occReport.data;
