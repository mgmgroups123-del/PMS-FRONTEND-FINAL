  import Client from "../../../api/index"

  export const getAllProperties = async (params?: any) => {
    try {
      const res = await Client.property.getAll(params)
      console.log("data Service:", res)
      return res
    } catch (error) {
      console.log("Error", error)
      throw error
    }
  }


  export const createProperty = async (data: any) => {
    try {
      const res = await Client.property.create(data)
      console.log("Create Data:",res)
      return res
    } catch (error) {
      console.log("Error",error)
      throw error
    }
  }


  export const editProperty = async (params: any, data: any) => {
      try {
          const res =await Client.property.edit(params,data)
          console.log("Edit data",res)
          return res
      } catch (error) {
          console.log("Error:",error)
          throw error
      }
  }


  export const deleteProperty = async (uuid: any) => {
    try {
      const res= await Client.property.delete(uuid)
      console.log("Delete:",res)
      return res
    } catch (error) {
      console.log("Error:",error)
          throw error
    }
  }


  export const getPropertyById = async (id: string) => {
    return await Client.property.getByid(id)
  }



export const createUnit = async (data: any) => {
  try {
    const res = await Client.unit.create(data) 
    console.log("Create Unit:", res)
    return res
  } catch (error) {
    console.log("Error creating unit:", error)
    throw error
  }
}

export const GetunitPropertyID=async(id:any)=>{
  try {
    const res=await Client.unit.getbypropertyid(id)
    console.log("Getting Unit:",res)
    return res
  } catch (error) {
    console.log("Error Getting unit:",error)
    throw error
  }
}

export const updatePropertyId=async(uuid:any,data:any)=>{
  try {
    const res=await Client.unit.update(uuid,data);
    console.log("Update data:",res)
    return res
  } catch (error) {
    console.log("Error update unit:",error)
    throw error
  }
}