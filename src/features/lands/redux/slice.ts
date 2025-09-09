import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LandsDetails, LandsInitialstate } from "../type"

const initialState: LandsInitialstate = {
    lands: [],
    selectedLand: {
        land_name: "",
        square_feet: "",
        acre: "",
        cent: "",
        land_address: "",
        owner_information: {
            full_name: "",
            email: "",
            phone: "",
            address: ""
        },
        uuid: "",
        is_active: false,
        is_deleted: false,
        image: ""
    }
}

const landstore = createSlice({
    name: "land",
    initialState,
    reducers: {
        setLandsDetails: (state, action: PayloadAction<LandsDetails[]>) => {
            state.lands = action.payload
        },
        selectedLandsDetails: (state, action: PayloadAction<LandsDetails>) => {
            state.selectedLand = action.payload
        },
        updateLandsDetails: (state, action: PayloadAction<LandsDetails>) => {
            const data = action.payload

            const index = state.lands.findIndex((item: LandsDetails) => item.uuid === data.uuid)

            if (index !== -1) {
                state.lands[index] = data
            } else {
                state.lands.unshift(data)
            }

        },
        deleteLandsDetails: (state, action: PayloadAction<string>) => {
            const data = action.payload
            const index = state.lands.findIndex((item: LandsDetails) => item.uuid === data)
            state.lands.splice(index, 1)
        },
    }
})


export const { setLandsDetails, selectedLandsDetails, updateLandsDetails, deleteLandsDetails } = landstore.actions

export default landstore.reducer