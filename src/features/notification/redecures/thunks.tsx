

import { getAllNotification } from "../services"
import { getNotification } from "./slice";


export const getNotificationAll = (params:any)=> async (dispatch:any)=>{
    try{
        const response = await getAllNotification(params);
        console.log(response?.data)
        if (response){
         
         dispatch(getNotification(response?.data))
        }
    }
    catch(error){
        console.log(error,'error ')
    }
}