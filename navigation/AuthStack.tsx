
import React from "react";
import StartScreen from "../screens/StartScreen";
import NameScreen from "../screens/NameScreen";
import SelectImage from "../screens/SelectImage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameSelectionScreen from "../screens/GameSelectionScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Image" component={SelectImage} />
      <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};
