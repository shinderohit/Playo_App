import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookScreen from '../screens/BookScreen';
import VenueInfoScreen from '../screens/VenueInfoScreen';
import SlotScreen from '../screens/SlotScreen';
import CreateActivityScreen from '../screens/CreateActivityScreen';

export type BookStackParamList = {
  BookHome: undefined;
  VenueInfo: {
    name: string;
    timings: string;
    location: string;
    rating: number;
    sportsAvailable: Array<{ name: string; icon: string }>;
    bookings: any[];
  };
  Slot: {
    place: string;
    sports: any[];
    bookings: any[];
  };
  Create: { area: string };
};

const Stack = createNativeStackNavigator<BookStackParamList>();

const BookStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookHome" component={BookScreen} />
      <Stack.Screen name="VenueInfo" component={VenueInfoScreen} />
      <Stack.Screen name="Slot" component={SlotScreen} options={{ tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="Create" component={CreateActivityScreen} options={{ tabBarStyle: { display: 'none' } }} />
    </Stack.Navigator>
  );
};

export default BookStackNavigator;
