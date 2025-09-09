export interface Notification {
  _id: string;
  title: string;
  description: string;
  is_read: boolean;
  createdAt: string;
  notify_type: string;
}

export interface NotificationState {
  notification: Notification[];
  unreadCount: number;
}