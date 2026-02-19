import { useOAuth } from "@clerk/clerk-expo";
import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

// Warm up the android browser to improve UX
// https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

function useSocialAuth() {
  useWarmUpBrowser();
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  const { startOAuthFlow: startGoogleAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleAuth } = useOAuth({
    strategy: "oauth_apple",
  });

  const handleSocialAuth = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      setLoadingStrategy(strategy);
      try {
        const startOAuthFlow =
          strategy === "oauth_google" ? startGoogleAuth : startAppleAuth;

        // Create a redirect URL for the OAuth flow
        // We need to use specific scheme for native apps
        const redirectUrl = Linking.createURL("/(auth)/sign-in", {
          scheme: "mobile",
        });

        const { createdSessionId, setActive, signUp, signIn } =
          await startOAuthFlow({
            redirectUrl,
          });

        if (createdSessionId) {
          if (setActive) {
            await setActive({ session: createdSessionId });
          }
        } else {
          // Use signIn or signUp for next steps such as MFA
        }
      } catch (err: any) {
        console.error("OAuth error", err);
        // Ignore "Session already exists" errors as they are not blocking
        if (err.errors?.[0]?.code === "session_exists") {
          return;
        }

        const provider = strategy === "oauth_google" ? "Google" : "Apple";
        Alert.alert(
          "Authentication Error",
          `Failed to sign in with ${provider}: ${err.errors?.[0]?.message || err.message || "Unknown error"}`,
        );
      } finally {
        setLoadingStrategy(null);
      }
    },
    [startGoogleAuth, startAppleAuth],
  );

  return { handleSocialAuth, loadingStrategy };
}

export default useSocialAuth;
