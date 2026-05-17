import { apiClient } from "../client/axiosInstance";

export const authApi = {
  login: async (data: any) => {
    // Backend expects 'identifier', mapping email to identifier
    const payload = {
      identifier: data.email || data.astuEmail,
      password: data.password
    };
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  register: async (data: any) => {
    // Contract mapping: Backend requires telegramId, mapped to 0 if unused on web
    const payload = {
      telegramId: 0, 
      astuEmail: data.astuEmail || data.email, // Maps to backend schema
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || "0900000000", // Required by backend
      password: data.password
    };
    // Backend route is /register, not /signup
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  toggleMode: async (mode: string) => {
    const response = await apiClient.patch("/users/me/toggle-mode", { mode });
    return response.data;
  },

  updateMe: async (data: Record<string, unknown>) => {
    const response = await apiClient.patch("/users/me", data);
    return response.data; // { success: true, data: { id, fullName, email, ... } }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return response.data; // { success: true, message: "Password updated successfully" }
  },
};