import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../endpoints/auth";
import { useAuth as useAuthContext } from "../../contexts/AuthContext";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
      localStorage.setItem("token", data.token);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
      localStorage.setItem("token", data.token);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      localStorage.removeItem("token");
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Fetch user data if needed
      return null;
    },
    enabled: false, // Disable automatic fetching
  });
};
