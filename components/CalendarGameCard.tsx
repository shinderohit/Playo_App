import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

interface Player {
  _id: string;
  imageUrl: string;
  name: string;
}

interface Game {
  _id: string;
  sport: string;
  area: string;
  date: string;
  time: string;
  activityAccess: string;
  totalPlayers: number;
  players: Player[];
  isBooked: boolean;
  courtNumber?: string;
  adminName: string;
  adminUrl?: string;
  matchFull: boolean;
  requests: { userId: string; comment: string; status: string }[];
  userRequestStatus?: string;
}

interface CalendarGameCardProps {
  game: Game;
  onCancelRequest?: () => void;
}

const CalendarGameCard: React.FC<CalendarGameCardProps> = ({
  game,
  onCancelRequest,
}) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const isPending = game.userRequestStatus === "pending";

  const handleCancelRequest = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://192.168.0.100:3001/api/games/${game._id}/cancel-request`,
        { userId: user.id }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Request cancelled successfully", [
          { text: "OK", onPress: () => onCancelRequest && onCancelRequest() },
        ]);
      }
    } catch (error: any) {
      console.error("Error cancelling request:", error.message);
      Alert.alert("Error", "Failed to cancel request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="p-4 bg-white rounded-xl mb-4 shadow-md"
      activeOpacity={0.8}
      onPress={() => navigation.navigate("GameDetails", { game })}
      disabled={loading}
    >
      <Text className="text-blue-600 text-base font-medium mb-3 border-b border-gray-100 pb-2">
        {game.date}
      </Text>

      {isPending ? (
        <View className="flex-row items-center gap-3">
          <View className="overflow-hidden">
            <Image
              source={{ uri: game.adminUrl || "https://i.pravatar.cc/100" }}
              className="w-12 h-12 rounded-full border border-gray-100"
            />
          </View>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              {game.adminName}'s {game.sport} Game
            </Text>
            <Text
              className="text-gray-500 text-sm mb-2"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {game.area}
            </Text>
            <Text className="text-yellow-600 font-medium text-sm">
              Awaiting Host Confirmation
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Players: {game.players.length} / {game.totalPlayers}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-red-600 p-2 rounded-lg"
            onPress={handleCancelRequest}
            disabled={loading}
          >
            <Text className="text-white text-sm font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center gap-3">
          <View className="overflow-hidden">
            <Image
              source={{ uri: game.adminUrl || "https://i.pravatar.cc/100" }}
              className="w-12 h-12 rounded-full border border-gray-100"
            />
          </View>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              {game.adminName}'s {game.sport} Game
            </Text>
            <Text
              className="text-gray-500 text-sm mb-2"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {game.area}
            </Text>
            <View className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
              {game.isBooked ? (
                <>
                  <Text className="text-center text-gray-700 font-medium text-xs mb-1">
                    Court {game.courtNumber}
                  </Text>
                  <Text className="text-center bg-green-600 text-white text-sm font-medium py-1.5 rounded-md">
                    Booked
                  </Text>
                </>
              ) : (
                <Text className="text-center text-gray-700 font-medium text-sm">
                  {game.time}
                </Text>
              )}
            </View>
            {game.matchFull && (
              <Image
                source={{
                  uri: "https://playo-website.gumlet.io/playo-website-v3/match_full.png",
                }}
                className="w-[100px] h-[70px] mt-2 self-center"
                resizeMode="contain"
              />
            )}
          </View>

          <View className="items-center justify-center">
            <Text className="text-2xl font-bold text-green-600">
              {game.players.length}
            </Text>
            <Text className="text-sm font-medium text-gray-600 mt-1">
              GOING
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CalendarGameCard;
