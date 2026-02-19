import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const { apiWithAuth } = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiWithAuth<User>({
        method: "POST",
        url: "/auth/callback",
      });
      return data;
    },
  });
};

export const useCurrentUser = () => {
  const { apiWithAuth } = useApi();

  // Added <User> type to useQuery to fix the 'never' error in your components
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // FIX 1: Corrected the URL typo from "/auth.me" to "/auth/me" (verify with your backend)
      // FIX 2: Added 'return' before the api call to ensure data is passed to TanStack Query
      const { data } = await apiWithAuth<User>({
        method: "GET",
        url: "/auth/me",
      });

      // FIX 3: Explicitly return the data
      return data;
    },
    // Optional: prevents the query from running if the user isn't logged in
    retry: false,
  });
};
