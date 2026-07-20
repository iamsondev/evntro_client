import axiosInstance from "./axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/notifications/unread-count");
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await axiosInstance.delete("/notifications");
  return response.data;
};
