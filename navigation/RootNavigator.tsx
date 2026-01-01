import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator } from "react-native";

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AppNavigator from "./AppNavigator";
import StartScreen from "../screens/StartScreen";
import NameScreen from "../screens/NameScreen";
import SelectImage from "../screens/SelectImage";
import GameSelectionScreen from "../screens/GameSelectionScreen";

export type RootStackParamList = {
  Auth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="Main" component={AppNavigator} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Name" component={NameScreen} />
          <Stack.Screen name="Image" component={SelectImage} />
          <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
