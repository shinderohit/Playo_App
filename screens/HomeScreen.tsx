import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, MessageCircle, User } from "lucide-react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useUserStore } from "../stores/userStore";
import { useNavigation } from "@react-navigation/native";

const spotlightData = [
  {
    id: "10",
    image:
      "https://playov2.gumlet.io/v3_homescreen/marketing_journey/Tennis%20Spotlight.png",
    text: "Learn Tennis",
    description: "Know more",
  },
  {
    id: "11",
    image:
      "https://playov2.gumlet.io/v3_homescreen/marketing_journey/playo_spotlight_08.png",
    text: "Up Your Game",
    description: "Find a coach",
  },
  {
    id: "12",
    image:
      "https://playov2.gumlet.io/v3_homescreen/marketing_journey/playo_spotlight_03.png",
    text: "Hacks to win",
    description: "Yes, Please!",
  },
  {
    id: "13",
    image:
      "https://playov2.gumlet.io/v3_homescreen/marketing_journey/playo_spotlight_02.png",
    text: "Spotify Playlist",
    description: "Show more",
  },
];

const HomeScreen = () => {
  const { user } = useUserStore();
  console.log("Data", user);
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 bg-white flex-row justify-between items-center border-b border-gray-200">
        <View className="flex-1">
          <Text className="text-gray-400 text-xs">Location</Text>
          <Text className="text-lg font-semibold text-black">
            Sahakar Nagar, Bengaluru
          </Text>
        </View>

        <View className="flex-row gap-4 items-center ml-2">
          <MessageCircle
            onPress={() => navigation.navigate("Chat")}
            size={20}
            stroke="#333"
          />
          <Bell size={20} stroke="#333" />
          <Pressable onPress={() => navigation.navigate("ProfileDetails")}>
            <Image
              source={{ uri: user?.image }}
              className="w-8 h-8 rounded-full"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        <View className="bg-[#F4F4F5] rounded-2xl p-4 mt-4 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold">
              Set Your Weekly Fit Goal 🔥
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              KEEP YOURSELF FIT!
            </Text>``
          </View>
          <Text className="text-3xl">➡️</Text>
        </View>

        <View className="bg-white border border-gray-200 rounded-2xl p-4 mt-4 shadow-sm relative">
          <Text className="text-sm font-semibold text-gray-400">
            START PLAYING!
          </Text>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-semibold mt-2">Create Game</Text>
              <Text className="text-base text-gray-500 mt-1">
                No upcoming games in your calendar
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Play", { screen: "CreateActivity" })
              }
              className="bg-white px-4 py-1.5 border border-gray-300 rounded-md"
            >
              <Text className="text-base font-semibold">CREATE</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Play", { initialTab: "Calendar" })
            }
            className="mt-3 self-center"
          >
            <Text className="text-[#222] font-semibold underline text-base">
              View My Calendar
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-[#F9FAFB] mt-5 rounded-2xl p-4 space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="bg-green-100 p-2 rounded-full">
                <Text className="text-xl">👥</Text>
              </View>
              <View>
                <Text className="font-semibold text-lg text-gray-800">
                  Groups
                </Text>
                <Text className="text-sm text-gray-500">
                  Connect, Compete and Discuss
                </Text>
              </View>
            </View>
            <Text className="text-xl text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between mt-6">
            <View className="flex-row items-center gap-3">
              <View className="bg-yellow-100 p-2 rounded-full">
                <Text className="text-xl">💡</Text>
              </View>
              <View>
                <Text className="font-semibold text-lg text-gray-800">
                  GameTime Activities
                </Text>
                <Text className="text-sm text-gray-500">
                  410 Playo hosted games
                </Text>
              </View>
            </View>
            <Text className="text-xl text-gray-400">›</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mt-5">
          <TouchableOpacity className="w-[48%] bg-white rounded-2xl border border-gray-200 p-4">
            <Text className="font-semibold text-base text-black">Bookings</Text>
            <Text className="text-sm text-gray-500">Game History</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-[48%] bg-white rounded-2xl border border-gray-200 p-4">
            <Text className="font-semibold text-base text-black">Playpals</Text>
            <Text className="text-sm text-gray-500">Manage Players</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold mt-6 mb-2">Spotlight</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {spotlightData.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="mr-4 bg-white rounded-xl w-48 overflow-hidden shadow-sm"
            >
              <Image
                source={{ uri: item.image }}
                className="w-full h-56"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-bold text-green-800 text-base">
                  {item.text}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="items-center mt-5 mb-6">
          <Text className="text-sm text-gray-500">FOLLOW US ON</Text>
          <View className="flex-row gap-4 mt-2">
            <Text className="text-lg">📷</Text>
            <Text className="text-lg">🐦</Text>
            <Text className="text-lg">💼</Text>
          </View>
        </View>

        <View className="bg-[#F9FAFB] rounded-2xl p-4 mb-6 flex-row items-center">
          <View className="bg-gray-100 p-3 rounded-full mr-3">
            <Text className="text-xl">🎁</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-base">
              Refer a Sports Enthusiast
            </Text>
            <Text className="text-sm text-gray-600">
              Earn <Text className="text-blue-500">50 karma points</Text> by
              inviting your friends
            </Text>
          </View>
        </View>
        <View className="items-center mb-10 mt-4">
          <Text className="text-2xl font-bold text-[#14b8a6]">PLAYO</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Your Sports Community App
          </Text>

          <View className="flex-row items-center space-x-2 mt-2">
            <TouchableOpacity>
              <Text className="text-sm text-blue-500 underline">
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-400">•</Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-500 underline">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-400">•</Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-500 underline">FAQs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
