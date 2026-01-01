import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import BookScreen from "../screens/BookScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import PlayScreen from "../screens/PlayScreen";
import { RouteProp } from "@react-navigation/native";
import PlayStackNavigator from "./PlayStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import BookStackNavigator from "./BookStackNavigator";

type TabParamList = {
  Home: undefined;
  Play: undefined;
  Book: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<TabParamList, keyof TabParamList>;
      }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: string = "";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Play") iconName = "person";
          else if (route.name === "Book") iconName = "calendar";
          else if (route.name === "More") iconName = "menu";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00b562",
        tabBarInactiveTintColor: "#666666",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Play"
        component={PlayStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Book"
        component={BookStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="More"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
