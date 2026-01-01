import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import GoogleSignIn from "../components/GoogleSignIn";
import { useSignIn } from "@clerk/clerk-expo";

const SignInScreen = () => {
  const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(
          "Sign-in incomplete:",
          JSON.stringify(signInAttempt, null, 2)
        );
        setError("Sign-in incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
      setError(err.errors[0]?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Image
        source={{
          uri: "https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50",
        }}
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold text-gray-800 mb-1">
        Welcome Back 👋
      </Text>
      <Text className="text-base text-gray-500 mb-6">Sign in to continue</Text>

      <TextInput
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email or Phone"
        placeholderTextColor="#aaa"
        style={{
          width: "100%",
          padding: 12,
          marginVertical: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
        }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={{
          width: "100%",
          padding: 12,
          marginVertical: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
        }}
      />

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      <Pressable
        onPress={onSignInPress}
        className="w-full bg-green-600 py-3 rounded-xl flex-row justify-center items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
        ) : (
          <Text className="text-white text-center font-semibold text-md">
            Sign In
          </Text>
        )}
      </Pressable>

      <View className="flex-row items-center w-full my-3">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <GoogleSignIn />
    </View>
  );
};

export default SignInScreen;
