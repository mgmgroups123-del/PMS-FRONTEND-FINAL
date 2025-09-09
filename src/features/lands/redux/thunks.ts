import type { AppDispatch } from "../../../store/store"
import { CreateLandsService, DeleteLandsService, GetLandsDetails, UpdateLandsService } from "../service"
import type { LandsDetails } from "../type"
import { deleteLandsDetails, setLandsDetails, updateLandsDetails } from "./slice"


export const GetLandsDetailsThunks = () => async (dispatch: AppDispatch) => {
    try {
        const response = await GetLandsDetails()
        dispatch(setLandsDetails(response.data))
    } catch (error) {
        console.log(error, "lands thunk")
    }
}

export const UpdateLandsThunks = (data: LandsDetails, params: string) => async (dispatch: AppDispatch) => {
    try {
        await UpdateLandsService(data, params)
        dispatch(updateLandsDetails(data))
    } catch (error) {
        console.log(error, "land thunks")
    }
}

export const DeleteLandsThunks = (params: string) => async (dispatch: AppDispatch) => {
    try {
        await DeleteLandsService(params)
        dispatch(deleteLandsDetails(params))
    } catch (error) {
        console.log(error, "land thunks")
    }
}

export const CreateLandsThunks = (data: LandsDetails) => async (dispatch: AppDispatch) => {
    try {
        await CreateLandsService(data)
        dispatch(updateLandsDetails(data))
    } catch (error) {
        console.log(error, "land thunks")
    }
}