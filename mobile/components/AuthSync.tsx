import { useAuthCallback } from "@/hooks/useAuth"
import { useEffect, useRef } from "react"
import { useAuth, useUser} from "@clerk/clerk-expo"


const AuthSync = () => {
    const {isSignedIn} = useAuth()
    const { user } = useUser()
    const {mutate:syncUser} = useAuthCallback()
    const hasSynced = useRef(false)

    useEffect(() => {
        if(!isSignedIn){
            hasSynced.current=false;
            return;
        }

        if(isSignedIn && user && !hasSynced.current){
            hasSynced.current=true
            syncUser(undefined,
                {
                    onSuccess: (data) => {
                        console.log("✅ User synced with backend: ", data.name);
                    },
                    onError: (error: any) => {
            console.log("❌ User sync failed:", error);
            hasSynced.current = false; // Allow retry on failure? Or maybe safe to keep true to avoid loop on consistent failure. 
            // If we reset to false here on error, and the error persists, it loops.
            // Better to NOT reset on error for now to stop the loop, unless we have a retry strategy.
            // Let's Log debug info.
            if (error?.response) {
              console.log("Error response data:", error.response.data);
              console.log("Error status:", error.response.status);
            }
          },
                })
        }
    },[isSignedIn,user,syncUser])

    return null
}

export default AuthSync