import { createSlice } from "@reduxjs/toolkit";

const ModuleSlice = createSlice({
  name: "Maintenance",
  initialState: {
    maintenancedata: [],
    property:[]
    
  },
  reducers: {
    getAllMaintenance: (state, action) => {
      state.maintenancedata = action.payload;
    },
     creatMaintenance: (state, action) => {
      state.maintenancedata = action.payload;
    },

    getproperty: (state, action) => {
      state.property = action.payload;
    },

    getunit: (state, action) => {
      state.property = action.payload;
    },

  },
});
export const {
  getAllMaintenance,creatMaintenance,getproperty,getunit

} = ModuleSlice.actions;
export default ModuleSlice.reducer;
