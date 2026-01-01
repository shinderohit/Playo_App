import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSignUp } from "@clerk/clerk-expo";
import { useUserOnboarding } from "../contexts/UserOnboardingContext";
import axios from "axios";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSessionId } = useUserOnboarding();
  const {
    setSports,
    sports: selectedSports,
    firstName,
    lastName,
    image,
    sessionId,
  } = useUserOnboarding();

  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.log("Sign up error:", JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log("SIGN UP ATTE", signUpAttempt);

      if (signUpAttempt.status === "complete") {
        try {
          const payload = {
            clerkId: signUpAttempt.createdUserId,
            email: signUpAttempt?.emailAddress,
            firstName,
            lastName,
            image: image,
            sports: ["Badminton", "Tennis", "Cricket", "Football"],
          };

          const res = await axios.post(
            "http://192.168.0.100:3001/api/users/create-or-update",
            payload
          );
          console.log("Data", res);
          if (res.data.success) {
            await setActive({ session: signUpAttempt.createdSessionId });
          }
        } catch (err) {
          console.log("Err", err);
        }
      } else {
        console.error(
          "Verification incomplete:",
          JSON.stringify(signUpAttempt, null, 2)
        );
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      setError(err.errors[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center bg-white px-6">
        <Text className="text-2xl font-bold mb-4 text-center">
          Verify Your Email
        </Text>
        <TextInput
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          style={{
            width: "100%",
            padding: 12,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
          autoCapitalize="none"
        />
        {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
        <TouchableOpacity
          onPress={onVerifyPress}
          className="bg-black py-4 rounded-xl flex-row justify-center items-center"
          disabled={loading}
        >
          {loading && (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          )}
          <Text className="text-white text-center font-bold text-base">
            Verify
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <View className="items-center mb-6">
        <Image
          source={{
            uri: "https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50",
          }}
          className="w-20 h-20"
          resizeMode="contain"
        />
        <Text className="text-lg font-semibold mt-2 text-gray-800">
          Welcome to Playo
        </Text>
        <Text className="text-sm text-gray-500">
          Create an account to get started
        </Text>
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-sm text-gray-600">Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: 12,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
      </View>

      <View className="mb-6">
        <Text className="mb-1 text-sm text-gray-600">Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={{
            width: "100%",
            padding: 12,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
          }}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <TouchableOpacity
        onPress={onSignUpPress}
        className="bg-black py-4 rounded-xl flex-row justify-center items-center"
        disabled={loading}
      >
        {loading && (
          <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
        )}
        <Text className="text-white text-center font-bold text-base">
          Continue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Text className="font-semibold text-black">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
