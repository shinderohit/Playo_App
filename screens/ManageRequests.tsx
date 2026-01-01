import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, PlusSquare, ToggleRight } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

interface Request {
  userId: string;
  comment: string;
  status: string;
  name: string;
  imageUrl: string;
}

interface Player {
  _id: string;
  name: string;
  imageUrl: string;
}

const ManageRequests: React.FC = () => {
  const [option, setOption] = useState<
    "Requests" | "Invited" | "Playing" | "Retired"
  >("Requests");
  const [requests, setRequests] = useState<Request[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const [matchFull, setMatchFull] = useState(false);
  const { user } = useUser();
  const gameId = (route.params as { gameId?: string })?.gameId;
  const navigation = useNavigation();

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.100:3001/api/games/${gameId}/requests`
      );
      console.log("Requests response:", JSON.stringify(response.data, null, 2));
      setRequests(response.data);
    } catch (error: any) {
      console.error(
        "Failed to fetch requests:",
        error.message,
        error.response?.data
      );
      Alert.alert("Error", "Failed to fetch requests");
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.100:3001/api/games/game/${gameId}/players`
      );
      console.log("Players response:", JSON.stringify(response.data, null, 2));
      setPlayers(response.data);
    } catch (error: any) {
      console.error(
        "Failed to fetch players:",
        error.message,
        error.response?.data
      );
      Alert.alert("Error", "Failed to fetch players");
    }
  };

  const toggleMatchFull = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.100:3001/api/games/toggle-match-full",
        {
          gameId,
          adminId: user?.id,
        }
      );
      if (response.status === 200) {
        setMatchFull(response.data.matchFull);
        Alert.alert(
          "Success",
          `Match full status set to ${response.data.matchFull ? "ON" : "OFF"}`
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to toggle match full:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to toggle match full"
      );
    }
  };

  const acceptRequest = async (userId: string) => {
    try {
      const response = await axios.post(
        "http://192.168.0.100:3001/api/games/accept",
        {
          gameId,
          userId,
          adminId: user?.id,
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Request accepted");
        await fetchRequests();
        await fetchPlayers();
      }
    } catch (error: any) {
      console.error(
        "Failed to accept request:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to accept request"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRequests(), fetchPlayers()]);
      setLoading(false);
    };
    if (gameId && user?.id) {
      fetchData();
    } else {
      console.error("Missing gameId or userId", { gameId, userId: user?.id });
      Alert.alert("Error", "Missing game ID or user ID");
      setLoading(false);
    }
  }, [gameId, user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-[#223536] px-4 pt-4 pb-3">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <PlusSquare color="white" size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-white text-xl font-semibold">Manage</Text>
          <TouchableOpacity
            onPress={toggleMatchFull}
            className="flex-row items-center gap-2"
          >
            <Text className="text-white text-base">Match Full</Text>
            <ToggleRight color="white" size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between mt-4">
          {["Requests", "Invited", "Playing", "Retired"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setOption(tab as any)}
              className="flex-1"
            >
              <Text
                className={`text-base font-semibold text-center ${
                  option === tab ? "text-green-400" : "text-white"
                }`}
              >
                {tab} (
                {tab === "Requests"
                  ? requests.length
                  : tab === "Playing"
                  ? players.length
                  : 0}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="px-4 pt-4">
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-lg">Loading...</Text>
          </View>
        ) : (
          <>
            {option === "Requests" && (
              <View>
                {requests.length === 0 ? (
                  <Text className="text-gray-500 text-center mt-10">
                    No pending requests
                  </Text>
                ) : (
                  requests.map((item, index) => (
                    <View
                      key={index}
                      className="bg-white rounded-xl p-4 mb-4 shadow-sm"
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={{
                            uri: item.imageUrl || "https://i.pravatar.cc/100",
                          }}
                          className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                          <Text className="text-gray-800 font-semibold">
                            {item.name}
                          </Text>
                          <View className="border border-orange-400 rounded-full px-3 py-1 mt-2 self-start">
                            <Text className="text-orange-400 text-xs">
                              INTERMEDIATE
                            </Text>
                          </View>
                        </View>
                        <Image
                          source={{
                            uri: "https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50",
                          }}
                          className="w-24 h-12"
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="text-gray-600 mt-2">{item.comment}</Text>
                      <View className="h-px bg-gray-200 my-3" />
                      <View className="flex-row justify-between items-center">
                        <View>
                          <View className="bg-gray-200 rounded px-3 py-1">
                            <Text className="text-gray-600 text-sm">
                              0 NO SHOWS
                            </Text>
                          </View>
                          <TouchableOpacity>
                            <Text className="text-gray-800 font-semibold underline mt-2">
                              See Reputation
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex-row gap-3">
                          <TouchableOpacity className="border border-gray-300 rounded-lg px-4 py-2">
                            <Text className="text-gray-800">RETIRE</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => acceptRequest(item.userId)}
                            className="bg-green-500 rounded-lg px-4 py-2"
                          >
                            <Text className="text-white">ACCEPT</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
            {option === "Playing" && (
              <View>
                {players.length === 0 ? (
                  <Text className="text-gray-500 text-center mt-10">
                    No players yet
                  </Text>
                ) : (
                  players.map((item, index) => (
                    <View
                      key={index}
                      className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
                    >
                      <Image
                        source={{
                          uri: item.imageUrl || "https://i.pravatar.cc/100",
                        }}
                        className="w-14 h-14 rounded-full mr-3"
                      />
                      <View>
                        <Text className="text-gray-800 font-semibold">
                          {item.name}
                        </Text>
                        <View className="border border-orange-400 rounded-full px-3 py-1 mt-2 self-start">
                          <Text className="text-orange-400 text-xs">
                            INTERMEDIATE
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
            {option === "Invited" && (
              <Text className="text-gray-500 text-center mt-10">
                No invited players
              </Text>
            )}
            {option === "Retired" && (
              <Text className="text-gray-500 text-center mt-10">
                No retired players
              </Text>
            )}
            <View className="h-8" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageRequests;
