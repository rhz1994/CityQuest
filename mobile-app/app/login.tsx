import React, { useEffect, useMemo, useState } from "react";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/tokens";
import { themeStyles } from "../styles/theme";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { user, isLoading, signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);

  const [googleRequest, googleResponse, promptGoogleAuth] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const canSubmit = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  useEffect(() => {
    const signInFromGoogle = async () => {
      if (googleResponse?.type !== "success") return;
      const accessToken = googleResponse.authentication?.accessToken;
      if (!accessToken) {
        setErrorMessage("Google sign-in succeeded but no access token was returned.");
        return;
      }

      try {
        setIsSubmittingGoogle(true);
        setErrorMessage(null);

        await signInWithGoogle({ providerAccessToken: accessToken });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not sign in with Google.",
        );
      } finally {
        setIsSubmittingGoogle(false);
      }
    };

    void signInFromGoogle();
  }, [googleResponse, signInWithGoogle]);

  if (!isLoading && user) {
    return <Redirect href="/(tabs)" />;
  }

  const submit = async () => {
    setErrorMessage(null);
    if (!canSubmit) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    try {
      setIsSubmittingEmail(true);
      await signInWithEmail({ userEmail: email, userName: name || undefined });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not sign in right now.",
      );
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const submitGoogle = async () => {
    setErrorMessage(null);
    if (!googleRequest) {
      setErrorMessage("Google Sign-In is not configured yet.");
      return;
    }
    await promptGoogleAuth();
  };

  return (
    <View
      style={[
        themeStyles.container,
        { justifyContent: "center", paddingHorizontal: 24, gap: 12 },
      ]}
    >
      <Text style={themeStyles.title}>Welcome to CityQuest</Text>
      <Text style={themeStyles.clueDesc}>
        Sign in with email to save your progress across devices.
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder="Display name (optional)"
        placeholderTextColor={colors.textMuted}
        style={{
          borderWidth: 1,
          borderColor: colors.accentGold,
          borderRadius: 10,
          padding: 12,
          color: colors.textPrimary,
          backgroundColor: colors.bgSurface,
        }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        style={{
          borderWidth: 1,
          borderColor: colors.accentGold,
          borderRadius: 10,
          padding: 12,
          color: colors.textPrimary,
          backgroundColor: colors.bgSurface,
        }}
      />

      {errorMessage ? (
        <Text style={{ color: "#ff7b7b", marginTop: 4 }}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        onPress={submit}
        disabled={isSubmittingEmail || isSubmittingGoogle}
        style={[
          themeStyles.solveButton,
          {
            opacity: isSubmittingEmail || isSubmittingGoogle ? 0.75 : 1,
            marginTop: 8,
          },
        ]}
      >
        {isSubmittingEmail ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Text style={themeStyles.solveButtonText}>Continue with email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => void submitGoogle()}
        disabled={isSubmittingEmail || isSubmittingGoogle}
        style={[
          themeStyles.solveButton,
          {
            opacity: isSubmittingEmail || isSubmittingGoogle ? 0.75 : 1,
            backgroundColor: colors.bgSurface,
            borderWidth: 1,
            borderColor: colors.accentGold,
          },
        ]}
      >
        {isSubmittingGoogle ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Text style={themeStyles.solveButtonText}>Continue with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
