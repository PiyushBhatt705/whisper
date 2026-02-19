import { useSocketStore } from "@/lib/socket";
import { useAuth } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const SocketConnection = () => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const isConnected = useSocketStore((state) => state.isConnected);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token && isMounted && !isConnected) {
            connect(token, queryClient);
          }
        } catch (err) {
          console.error("Token retrieval failed", err);
        }
      } else {
        disconnect();
      }
    };

    setup();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, isConnected]); // isSignedIn triggers the check, isConnected prevents loops

  return null;
};

export default SocketConnection;