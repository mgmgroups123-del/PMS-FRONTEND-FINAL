import Client from "../../../api/index"
export const fetchOccReport=async(data?:any)=>{
  try {
    const res=await Client.dashboard.getOccReport(data);
    console.log("occ Report:",res)
    return res;
  } catch (error) {
    console.log("Error For report",error)
  }
}

export const fetchDownloadReport=async(data?:any)=>{
  try {
    const res=await Client.property.download(data);
    console.log("occ Report:",res)
    return res;
  } catch (error) {
    console.log("Error For report",error)
  }
}