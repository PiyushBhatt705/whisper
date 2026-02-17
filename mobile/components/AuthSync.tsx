import { useAuthCallback } from "@/hooks/useAuth"
import { useEffect, useRef } from "react"
import { useAuth, useUser} from "@clerk/clerk-expo"


const AuthSync = () => {
    const {isSignedIn} = useAuth()
    const { user } = useUser()
    const {mutate:syncUser} = useAuthCallback()
    const hasSynced = useRef(false)

    useEffect(() => {
        if(isSignedIn && user && !hasSynced.current){
            hasSynced.current=true
            syncUser(undefined,
                {
                    onSuccess: (data) => {
                        console.log("✅ User synced with backend: ", data.name);
                    },
                    onError: (error: any) => {
            console.log("❌ User sync failed:", error);
            if (error?.response) {
              console.log("Error response data:", error.response.data);
              console.log("Error status:", error.response.status);
            }
          },
                })
        if(!isSignedIn){
            hasSynced.current=false
        }
        }
    },[isSignedIn,user,syncUser])

    return null
}

export default AuthSync