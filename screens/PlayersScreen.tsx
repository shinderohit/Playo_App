import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Share, MoreVertical, Globe } from "lucide-react-native";

interface Player {
  _id: string;
  imageUrl: string;
  name: string;
}

interface PlayersScreenParams {
  players: Player[];
  activityAccess: string;
}

const PlayersScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { players, activityAccess } = route.params as PlayersScreenParams;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-[#294461] p-4 pb-6">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity>
              <Share color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                alert("More options coming soon!");
              }}
            >
              <MoreVertical color="green" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 flex-row justify-between items-center">
          <Text className="text-white text-lg font-semibold">
            Players ({players.length})
          </Text>
          <View className="flex-row gap-2 items-center">
            <Globe color="white" size={24} />
            <Text className="text-white text-base">
              {activityAccess === "public" ? "Public" : "Invite Only"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="px-4 pt-4">
        <View className="bg-white rounded-xl p-4 border border-gray-300 shadow-lg shadow-gray-300/50 mb-4">
          {players.length === 0 ? (
            <Text className="text-gray-500 text-center text-base">
              No players found.
            </Text>
          ) : (
            players.map((player, index) => (
              <TouchableOpacity
                key={player._id}
                className="flex-row items-center gap-4 mb-4"
                activeOpacity={0.8}
                onPress={() => {
                  /* Future: Navigate to player profile */
                }}
              >
                <Image
                  source={{
                    uri: player.imageUrl || "https://i.pravatar.cc/100",
                  }}
                  className="w-16 h-16 rounded-full"
                />
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">
                    {player.name}
                  </Text>
                  <View className="mt-2 border border-orange-500 px-2 py-1 rounded-full w-32">
                    <Text className="text-xs font-semibold text-orange-500 text-center">
                      INTERMEDIATE
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayersScreen;
