import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useUserStore } from "../stores/userStore";

const ProfileDetailScreen = () => {
  const { user } = useUserStore();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-gray-50">
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row items-center gap-4">
            <Image
              source={{
                uri: user?.image || "https://i.pravatar.cc/150?img=32",
              }}
              className="w-16 h-16 rounded-full"
            />
            <View>
              <Text className="text-xl font-semibold">{user?.firstName}</Text>
              <Text className="text-gray-500 text-sm">
                Last played on 12th July
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="text-xl font-bold">{user?.noOfGames || 0}</Text>
              <Text className="text-gray-500 text-sm">GAMES</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold">
                {user?.playpals?.length || 0}
              </Text>
              <Text className="text-gray-500 text-sm">PLAYPALS</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold">1.3k</Text>
              <Text className="text-gray-500 text-sm">KARMA</Text>
            </View>
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4 flex-row items-center">
          <View className="bg-red-100 p-2 rounded-full">
            <Text className="text-red-500 text-lg">🔥</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-base">
              Set your Weekly Fit Goal 🎯
            </Text>
            <Text className="text-gray-500 text-sm">
              You can now set your goal and keep yourself fit!
            </Text>
            <Text className="text-green-600 mt-1 font-semibold">Set Now</Text>
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-base">Active Level</Text>
            <Text className="text-green-600">Learn More</Text>
          </View>
          <View className="flex-row justify-between mt-4">
            <Text className="text-orange-400">Warming Up</Text>
            <Text className="text-cyan-400">Active</Text>
            <Text className="text-purple-400">Super Active</Text>
            <Text className="text-red-400">On Fire</Text>
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row justify-between mb-4">
            <Text className="font-semibold text-base">Reputation Badges</Text>
            <Text className="text-green-600">See All</Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            <View className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4 w-[48%] items-center">
              <View className="bg-blue-100 p-4 rounded-full mb-2">
                <Text className="text-blue-600 text-xl">⏰</Text>
              </View>
              <Text className="text-center font-medium text-gray-800">
                Punctual (46)
              </Text>
            </View>
            <View className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4 w-[48%] items-center">
              <View className="bg-blue-100 p-4 rounded-full mb-2">
                <Text className="text-blue-600 text-xl">👥</Text>
              </View>
              <Text className="text-center font-medium text-gray-800">
                Team Player (47)
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-gradient-to-r from-blue-50 to-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row justify-between mb-4">
            <Text className="font-semibold text-base text-gray-800">
              Leaderboard
            </Text>
            <Text className="text-green-600">View Leaderboard</Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="text-gray-700 font-medium">🏸 Badminton</Text>
              <Text className="text-gray-700">260 Games</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="text-gray-700 font-medium">🏏 Cricket</Text>
              <Text className="text-gray-700">2 Games</Text>
            </View>
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4 mb-8">
          <Text className="text-center text-gray-600 text-sm">
            Stay updated with your play stats and connect with your playpals!
          </Text>
          <TouchableOpacity className="mt-3 bg-green-600 py-2 rounded-lg">
            <Text className="text-white text-center font-semibold">
              Check Updates
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetailScreen;
