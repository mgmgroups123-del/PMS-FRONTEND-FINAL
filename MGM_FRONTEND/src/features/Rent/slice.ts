import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface Rent {
  id: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  month: string;
  status: "Paid" | "Pending" | "Overdue";
}


interface RentState {
  data: Rent[];
  selectedRent: Rent | null;
}

const initialState: RentState = {
  data: [],
  selectedRent: null,
};

const rentSlice = createSlice({
  name: "rent",
  initialState,
  reducers: {
   
    getRents: (state, action: PayloadAction<Rent[]>) => {
      state.data = action.payload;
    },

   
  },
});

export const {
  getRents
} = rentSlice.actions;

export default rentSlice.reducer;
