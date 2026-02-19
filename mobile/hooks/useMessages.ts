import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/axios";
import type { Message } from "@/types";

export const useMessages = (chatId: string) => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async (): Promise<Message[]> => {
      try {
        const { data } = await apiWithAuth<Message[]>({
          method: "GET",
          // FIXED: Added the missing forward slash before ${chatId}
          url: `/messages/chats/${chatId}`,
        });

        // Ensure we always return an array, even if the backend returns null/undefined
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching messages:", error);
        return []; // Return empty array on error to prevent UI crash
      }
    },
    enabled: !!chatId,
  });
};
