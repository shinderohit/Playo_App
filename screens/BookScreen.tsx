import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import VenueCard from "../components/VenueCard";
import { useUserStore } from "../stores/userStore";
import { useUser } from "@clerk/clerk-expo";

const BookScreen = () => {
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.100:3001/api/venues"
        );
        setVenues(response.data);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      }
    };

    fetchVenues();
  }, []);

  const { user } = useUser();
  const { user: userData } = useUserStore();

  const filteredVenues = useMemo(() => {
    if (!searchQuery) return venues;

    return venues.filter((venue) => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = venue.name.toLowerCase().includes(searchLower);
      const addressMatch = venue.address.toLowerCase().includes(searchLower);
      const sportsMatch = venue.sportsAvailable.some((sport) =>
        sport.name.toLowerCase().includes(searchLower)
      );
      return nameMatch || addressMatch || sportsMatch;
    });
  }, [searchQuery, venues]);

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center space-x-1">
          <Text className="text-base font-medium">Sahakar Nagar</Text>
          <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
        </View>

        <View className="flex-row items-center gap-3">
          <Ionicons name="chatbox-outline" size={22} color="black" />
          <Ionicons name="notifications-outline" size={22} color="black" />
          <Image
            className="w-8 h-8 rounded-full"
            source={{
              uri: userData?.image,
            }}
          />
        </View>
      </View>

      <View className="mx-4 flex-row items-center justify-between bg-[#e8e8e8] px-4 py-3 rounded-full mb-4">
        <TextInput
          placeholder="Search For Venues"
          className="flex-1 text-base"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={22} color="gray" />
      </View>

      <View className="flex-row space-x-3 px-4 py-4">
        {["Sports & Availability", "Favorites", "Offers"].map((label, idx) => (
          <View
            key={idx}
            className="border-2 border-gray-200 rounded-xl px-4 py-2"
          >
            <Text className="text-sm text-gray-700">{label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredVenues}
        renderItem={({ item }) => <VenueCard item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          searchQuery ? (
            <View className="items-center mt-10">
              <Text className="text-gray-500 text-lg">No venues found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default BookScreen;
