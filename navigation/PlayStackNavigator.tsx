import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlayScreen from "../screens/PlayScreen";
import CreateActivityScreen from "../screens/CreateActivityScreen";
import SelectTimeScreen from "../screens/SelectTimeScreen";
import TagVenueScreen from "../screens/TagVenueScreen";
import GameSetUpScreen from "../screens/GameSetUpScreen";
import PlayersScreen from "../screens/PlayersScreen";
import SlotScreen from "../screens/SlotScreen";
import ManageRequests from "../screens/ManageRequests";

export type PlayStackParamList = {
  PlayHome: undefined;
  CreateActivity: undefined;
};

const Stack = createNativeStackNavigator();

const PlayStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlayHome" component={PlayScreen} />
      <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
      <Stack.Screen name="SelectTime" component={SelectTimeScreen} />
      <Stack.Screen name="TagVenue" component={TagVenueScreen} />
      <Stack.Screen name="GameDetails" component={GameSetUpScreen} />
      <Stack.Screen name="Players" component={PlayersScreen} />
      <Stack.Screen name="Slot" component={SlotScreen} />
      <Stack.Screen name="Manage" component={ManageRequests} />
    </Stack.Navigator>
  );
};

export default PlayStackNavigator;
