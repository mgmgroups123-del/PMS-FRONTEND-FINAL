import Client from '../../../api/index'
import type { LandsDetails } from '../type'

export const GetLandsDetails = async () => {
    const response = await Client.land.getAll('')
    return response
}

export const UpdateLandsService = async (data: LandsDetails, params: string) => {
    const response = await Client.land.edit(data, params)
    return response
}

export const DeleteLandsService = async (params: string) => {
    const response = await Client.land.delete(params)
    return response
}

export const CreateLandsService = async (data: LandsDetails) => {
    const response = await Client.land.create(data)
    return response
}

export const GetByIdLandService = async (params: any) => {
    const response = await Client.land.getByid(params)
    return response
}

