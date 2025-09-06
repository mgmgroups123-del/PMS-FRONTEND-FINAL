import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationState } from "./notifyType";

const initialState: NotificationState = {
  notification: [],
  unreadCount: 0,
};

const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState,
  reducers: {
    getNotification: (state, action: PayloadAction<Notification[]>) => {
      state.notification = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notification.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const index = state.notification.findIndex((n) => n._id === action.payload);
      if (index !== -1 && !state.notification[index].is_read) {
        state.notification[index].is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications: (state) => {
      state.notification = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  getNotification,
  addNotification,
  markAsRead,
  clearNotifications,
} = NotificationSlice.actions;
export default NotificationSlice.reducer;
