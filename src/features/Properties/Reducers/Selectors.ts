export const selectProperties = (state: any) => state.property.data
export const selectPropertiesLoading = (state: any) => state.property.loading
export const selectPropertiesError = (state: any) => state.property.console.error();
export const selectUnits = (state: any) => state.property.units?.data || [];