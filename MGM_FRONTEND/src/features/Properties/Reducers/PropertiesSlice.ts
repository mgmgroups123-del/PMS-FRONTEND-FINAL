import { createSlice } from "@reduxjs/toolkit";

interface Unit {
  id: string;
  propertyId: string;
  name: string;
  sqFeet: string;
  address: string;
  image?: string;
  status?: 'occupied' | 'vacant';
  uuid: string;
}

interface Property {
  id: string;
  name: string;
  location?: string;
  units?: Unit[];
}

const propertySlice = createSlice({
  name: "property",
  initialState: {
    data: [] as Property[],
    loading: false,
    error: null as string | null,
    units: [] as Unit[],
  },
  reducers: {
    setProperty(state, action) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addProperty(state, action) {
      state.data.push(action.payload);
      state.loading = false;
    },
    updateProperty(state, action) {
      const index = state.data.findIndex(
        (prop) => prop.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
      state.loading = false;
    },
    removeProperty(state, action) {
      state.data = state.data.filter((prop) => prop.id !== action.payload);
    },
    addUnit(state, action) {
      state.units.push(action.payload);
      state.loading = false;
    },
    setUnits(state, action) {
      state.units = action.payload;
      state.loading = false;
    },
    updateUnit(state, action) {
      const index = state.units.findIndex(unit => unit.uuid === action.payload.uuid);
      if (index !== -1) {
        state.units[index] = { ...state.units[index], ...action.payload };
      }
    },
  },
});

export const {
  setProperty,
  setLoading,
  setError,
  addProperty,
  updateProperty,
  removeProperty,
  addUnit,
  setUnits, 
  updateUnit,
} = propertySlice.actions;

export default propertySlice.reducer;