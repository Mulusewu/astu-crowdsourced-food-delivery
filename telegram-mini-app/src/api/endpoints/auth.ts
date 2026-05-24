import { apiClient } from "../client/axiosInstance";

export const authApi = {
  login: async (data: any) => {
    // Backend expects 'identifier', mapping email to identifier
    const payload = {
      identifier:  data.identifier,
      password: data.password
    };
    const response = await apiClient.post("/auth/login", payload);
    console.log('User payloadd', payload);
    
    return response.data;
  },

  register: async (data: any) => {
    // Contract mapping: Backend requires telegramId, mapped to 0 if unused on web
    const payload = {
      telegramId: 0, 
      astuEmail: data.astuEmail, // Maps to backend schema
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || "0900000000", // Required by backend
      password: data.password
    };
    // Backend route is /register, not /signup
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

   registerVendor: async (data: any) => {
    const payload = {
      telegramId: 1232030867348,
      fullName: data.vendorName, // Map to backend fullName
      phoneNumber: data.contactNumber,
      email: data.email,
      password: data.password,
      // businessDocumentUrl: data.businessDocumentUrl
       businessDocumentUrl: "https://example.com/license-placeholder.pdf"
    };
    const response = await apiClient.post("/auth/register/vendor", payload);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  toggleMode: async (mode: string) => {
    const response = await apiClient.patch("/users/me/toggle-mode", { mode });
    return response.data;
  },
 

  verifyEmail: async (data: { astuEmail: string, otp: string }) => {
    const response = await apiClient.post("/auth/verify-email", data);
    return response.data;
  },

  verifyPhone: async (data: { phoneNumber: string, otp: string }) => {
    const response = await apiClient.post("/auth/verify-phone", data);
    return response.data;
  },

  resendVerification: async (identifier: string) => {
    const response = await apiClient.post("/auth/resend-verification", { identifier });
    return response.data;
  }
};