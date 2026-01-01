import {
  Pressable,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import React from "react";
import Amenities from "../components/Amenities";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";

const VenueInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <ScrollView>
        <Image
          className="w-full h-52"
          source={{
            uri: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800",
          }}
        />

        <View className="p-4">
          <Text className="text-xl font-semibold">{route.params.name}</Text>

          <View className="flex-row items-center mt-2 space-x-2">
            <Ionicons name="time-outline" size={22} color="black" />
            <Text className="text-base font-medium">
              {route.params.timings}
            </Text>
          </View>

          <View className="flex-row items-center mt-2 space-x-2">
            <Ionicons name="location-outline" size={22} color="black" />
            <Text className="text-sm font-medium w-[80%]">
              {route.params.location}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-around px-4 py-2">
          <View>
            <View className="flex-row">
              {[0, 0, 0, 0, 0].map((_, i) => (
                <FontAwesome
                  key={i}
                  className="px-1"
                  name={i < Math.floor(route.params.rating) ? "star" : "star-o"}
                  size={15}
                  color="#FFD700"
                />
              ))}
              <Text>{route.params.rating} (9 ratings)</Text>
            </View>
            <Pressable className="mt-2 w-40 border border-gray-400 rounded-md py-2 items-center">
              <Text className="text-sm font-medium">Rate Venue</Text>
            </Pressable>
          </View>

          <View>
            <Text className="text-sm text-center">100 total Activities</Text>
            <Pressable className="mt-2 w-40 border border-gray-400 rounded-md py-2 items-center">
              <Text className="text-sm font-medium">1 Upcoming</Text>
            </Pressable>
          </View>
        </View>

        <Text className="text-base font-semibold mx-4 mt-4">
          Sports Available
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {route.params.sportsAvailable.map((item, index) => (
            <View
              key={index}
              className="border border-gray-400 m-3 p-5 w-32 h-24 rounded-md justify-center"
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="gray"
                style={{ textAlign: "center" }}
              />
              <Text className="text-center mt-2 font-bold">{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        <Amenities />

        <View className="mx-4 mt-4">
          <Text className="text-base font-semibold">Activities</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("Create", {
                area: route.params.name,
              })
            }
            className="border border-gray-400 mt-3 rounded-md py-2 flex-row justify-center items-center space-x-2"
          >
            <AntDesign name="plus" size={22} color="black" />
            <Text className="text-base font-medium">Create Activity</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable
        onPress={() =>
          navigation.navigate("Slot", {
            place: route.params.name,
            sports: route.params.sportsAvailable,
            bookings: route?.params?.bookings || [],
          })
        }
        className="bg-green-600 p-3 mb-8 rounded-md mx-4"
      >
        <Text className="text-center text-white font-bold text-base">
          Book Now
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default VenueInfoScreen;
