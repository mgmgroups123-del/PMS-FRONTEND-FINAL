import type { RootState } from "../../../store/store";

export const selectNotification = (state:RootState)=>state.NotificationReducer.notification
export const selectUnreadCount = (state:RootState)=> state.NotificationReducer.unreadCount