import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  Globe,
  MapPin,
  ChevronRight,
  Share2,
  MoreVertical,
} from "lucide-react-native";
import Modal from "react-native-modal";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

interface Player {
  _id: string;
  imageUrl: string;
  name: string;
}

interface Request {
  userId: string;
  comment: string;
  status: string;
  name: string;
  imageUrl: string;
}

interface Venue {
  name: string;
  sportsAvailable: string[];
  bookings: any[];
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
  isUserAdmin: boolean;
  requests: Request[];
  queries?: any[];
}

const GameDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { game } = route.params as { game: Game };
  const { user } = useUser();
  const userId = user?.id;
  const [players, setPlayers] = useState<Player[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchFull, setMatchFull] = useState(game.matchFull);
  const [queryModalVisible, setQueryModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [comment, setComment] = useState("");

  const userRequested = requests.some((req) => req.userId === userId);

  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setQueryModalVisible(false);
            setJoinModalVisible(false);
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const playersResponse = await axios.get(
          `http://192.168.0.100:3001/api/games/game/${game._id}/players`
        );
        console.log(
          "Fetched players:",
          JSON.stringify(playersResponse.data, null, 2)
        );
        setPlayers(playersResponse.data);

        const requestsResponse = await axios.get(
          `http://192.168.0.100:3001/api/games/${game._id}/requests`
        );
        console.log(
          "Fetched requests:",
          JSON.stringify(requestsResponse.data, null, 2)
        );
        setRequests(requestsResponse.data);

        const venuesResponse = await axios.get(
          "http://192.168.0.100:3001/api/venues"
        );
        setVenues(venuesResponse.data);
      } catch (error: any) {
        console.error(
          "Failed to fetch data:",
          error.message,
          error.response?.data
        );
        Alert.alert(
          "Error",
          "Failed to fetch data. Using game data as fallback."
        );
        setPlayers(game.players);
      } finally {
        setLoading(false);
      }
    };

    if (game._id) {
      fetchData();
    } else {
      console.error("No game ID provided");
      Alert.alert("Error", "Invalid game data. Please try again.");
      setLoading(false);
    }
  }, [game._id]);

  const venue = venues.find((item) => item.name === game.area);
  const [startTime, endTime] = game.time
    .split(" - ")
    .map((time) => time.trim());

  const sendJoinRequest = async () => {
    try {
      const response = await axios.post(
        `http://192.168.0.100:3001/api/games/${game._id}/request`,
        {
          userId,
          comment,
        }
      );

      if (response.status === 200) {
        Alert.alert("Request Sent", "Please wait for the host to accept!", [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              setJoinModalVisible(false);
              setComment("");
              fetchRequests();
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error(
        "Failed to send join request:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send join request"
      );
    }
  };

  const sendQuery = async () => {
    try {
      const response = await axios.post(
        `http://192.168.0.100:3001/api/games/${game._id}/queries`,
        {
          userId,
          query,
        }
      );

      if (response.status === 200) {
        Alert.alert("Query Sent", "Your query has been sent to the host!", [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              setQueryModalVisible(false);
              setQuery("");
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error(
        "Failed to send query:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send query"
      );
    }
  };

  const cancelJoinRequest = async () => {
    try {
      const response = await axios.post(
        `http://192.168.0.100:3001/api/games/${game._id}/cancel-request`,
        {
          userId,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Request Cancelled",
          "Your join request has been cancelled.",
          [{ text: "OK", onPress: () => fetchRequests() }]
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to cancel join request:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to cancel join request"
      );
    }
  };

  const fetchRequests = async () => {
    try {
      const requestsResponse = await axios.get(
        `http://192.168.0.100:3001/api/games/${game._id}/requests`
      );
      setRequests(requestsResponse.data);
    } catch (error: any) {
      console.error("Failed to fetch requests:", error.message);
    }
  };

  const toggleMatchFullStatus = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.100:3001/api/games/toggle-match-full",
        {
          gameId: game._id,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Success",
          `Match full status ${
            response.data.matchFull ? "enabled" : "disabled"
          }`
        );
        setMatchFull(response.data.matchFull);
      }
    } catch (error: any) {
      console.error(
        "Failed to toggle match full status:",
        error.message,
        error.response?.data
      );
      Alert.alert("Error", "Failed to toggle match full status");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="bg-[#294461] p-4 pb-6">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <View className="flex-row gap-4">
              <Share2 color="white" size={24} />
              <MoreVertical color="white" size={24} />
            </View>
          </View>

          <View className="mt-6 flex-row items-center gap-4">
            <Text className="text-white text-2xl font-bold">{game.sport}</Text>
            <View className="bg-white px-3 py-1 rounded-lg">
              <Text className="text-gray-800 text-sm font-medium">
                Mixed Doubles
              </Text>
            </View>
            <View className="ml-auto flex-row items-center gap-2">
              <Text className="text-white text-base font-medium">
                Match Full
              </Text>
              <TouchableOpacity onPress={toggleMatchFullStatus}>
                <Text className="text-white text-2xl">
                  {matchFull ? "🔒" : "🔓"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mt-4 text-white text-base font-semibold">
            {game.date}, {startTime}
          </Text>

          <TouchableOpacity
            className="mt-4 bg-green-500 px-4 py-2 rounded-lg flex-row items-center gap-2 w-11/12"
            onPress={() =>
              navigation.navigate("Slot", {
                place: game.area,
                sports: venue?.sportsAvailable || [],
                date: game.date,
                slot: game.time,
                startTime,
                endTime,
                gameId: game._id,
                bookings: venue?.bookings,
              })
            }
          >
            <MapPin color="white" size={24} />
            <Text className="text-white text-base">{game.area}</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-4 mt-6 bg-white p-4 rounded-lg flex-row items-center gap-3">
          <Text className="text-2xl">↔️</Text>
          <View>
            <Text className="text-base font-semibold">Add Expense</Text>
            <Text className="text-gray-500 text-sm mt-1 w-3/4">
              Start adding your expenses to split cost among players
            </Text>
          </View>
          <ChevronRight color="gray" size={24} />
        </View>

        <View className="mx-4 mt-6">
          <Image
            source={{
              uri: "https://playo.gumlet.io/OFFERS/PlayplusSpecialBadmintonOfferlzw64ucover1614258751575.png",
            }}
            className="w-full h-56 rounded-xl"
            resizeMode="cover"
          />
        </View>

        <View className="mx-4 mt-6 bg-white p-4 rounded-xl">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">
              Players ({players.length})
            </Text>
            <Globe color="gray" size={24} />
          </View>

          <View className="mt-4 flex-row justify-between items-center">
            <Text className="text-base font-medium">
              ❤️ You are not covered 🙂
            </Text>
            <Text className="text-base font-medium text-blue-600">
              Learn More
            </Text>
          </View>

          {loading ? (
            <Text className="text-gray-500 text-center mt-4">
              Loading players...
            </Text>
          ) : players.length === 0 ? (
            <Text className="text-gray-500 text-center mt-4">
              No players found.
            </Text>
          ) : (
            <>
              <View className="mt-4 flex-row items-center gap-4">
                <Image
                  source={{ uri: game.adminUrl || "https://i.pravatar.cc/100" }}
                  className="w-16 h-16 rounded-full"
                />
                <View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-medium">
                      {game.adminName}
                    </Text>
                    <View className="bg-gray-200 px-2 py-1 rounded-md">
                      <Text className="text-xs font-semibold">HOST</Text>
                    </View>
                  </View>
                  <View className="mt-2 bg-amber-300 px-2 py-1 rounded-md self-start">
                    <Text className="text-xs font-medium text-black">
                      INTERMEDIATE
                    </Text>
                  </View>
                </View>
              </View>

              {players
                .filter((player) => player.name !== game.adminName)
                .map((player, index) => (
                  <View
                    key={index}
                    className="mt-4 flex-row items-center gap-4"
                  >
                    <Image
                      source={{
                        uri: player.imageUrl || "https://i.pravatar.cc/100",
                      }}
                      className="w-16 h-16 rounded-full"
                    />
                    <View>
                      <Text className="text-base font-medium">
                        {player.name}
                      </Text>
                      <View className="mt-2 border border-orange-400 px-2 py-1 rounded-md w-32">
                        <Text className="text-xs font-semibold text-orange-800">
                          INTERMEDIATE
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </>
          )}

          {game.isUserAdmin ? (
            <>
              <View className="border-t border-gray-200 my-4" />
              <TouchableOpacity className="flex-row items-center gap-4">
                <View className="w-16 h-16 border border-gray-200 rounded-full justify-center items-center">
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/343/343303.png",
                    }}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-base font-medium flex-1">
                  Add Co-Host
                </Text>
                <ChevronRight color="black" size={24} />
              </TouchableOpacity>

              <View className="border-t border-gray-200 my-4" />
              <View className="flex-row justify-between items-center">
                <TouchableOpacity className="items-center">
                  <View className="w-16 h-16 border border-gray-200 rounded-full justify-center items-center">
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/1474/1474545.png",
                      }}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="mt-2 text-sm font-medium">Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Manage", {
                      requests,
                      userId,
                      gameId: game._id,
                    })
                  }
                  className="items-center"
                >
                  <View className="w-16 h-16 border border-gray-200 rounded-full justify-center items-center">
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/7928/7928637.png",
                      }}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="mt-2 text-sm font-medium">
                    Manage ({requests.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Players", {
                      players,
                      activityAccess: game.activityAccess,
                    })
                  }
                  className="items-center"
                >
                  <View className="w-12 h-12 border border-gray-200 rounded-full justify-center items-center">
                    <ChevronRight color="black" size={24} />
                  </View>
                  <Text className="mt-2 text-sm font-semibold">
                    All Players
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="border-t border-gray-200 my-4" />
              <TouchableOpacity className="flex-row items-center gap-4">
                <View className="w-16 h-16 border border-gray-200 rounded-full justify-center items-center">
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/128/1511/1511847.png",
                    }}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text className="text-base font-medium">
                    Not on Playo? Invite
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1 w-3/4">
                    Earn 100 Karma points by referring your friend
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              className="mt-6 border-t border-b border-gray-200 py-4 flex-row justify-between items-center"
              onPress={() =>
                navigation.navigate("Players", {
                  players,
                  activityAccess: game.activityAccess,
                })
              }
            >
              <Text className="text-base font-semibold">All Players</Text>
              <ChevronRight color="black" size={24} />
            </TouchableOpacity>
          )}
        </View>

        <View className="mx-4 mt-6 bg-white p-4 rounded-xl mb-4">
          <Text className="text-lg font-semibold">
            Queries ({game.queries?.length || 0})
          </Text>
          <View className="mt-4">
            <Text className="text-gray-500 text-center">
              There are no queries yet! Queries sent by players will be shown
              here
            </Text>
          </View>
        </View>
      </ScrollView>

      {!game.isUserAdmin && !userRequested && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              className="flex-1 bg-white p-4 rounded-lg mr-2 border border-gray-300"
              onPress={() => setQueryModalVisible(true)}
            >
              <Text className="text-center text-base font-semibold text-gray-800">
                SEND QUERY
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-green-600 p-4 rounded-lg"
              onPress={() => setJoinModalVisible(true)}
            >
              <Text className="text-center text-base font-semibold text-white">
                JOIN GAME
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {game.isUserAdmin ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <TouchableOpacity className="bg-green-600 p-4 rounded-lg">
            <Text className="text-center text-white text-base font-semibold">
              GAME CHAT
            </Text>
          </TouchableOpacity>
        </View>
      ) : userRequested ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <TouchableOpacity
            onPress={cancelJoinRequest}
            className="bg-red-600 p-4 rounded-lg"
          >
            <Text className="text-center text-white text-base font-semibold">
              CANCEL REQUEST
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal
        isVisible={queryModalVisible}
        onBackdropPress={() => setQueryModalVisible(false)}
        onBackButtonPress={() => setQueryModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setQueryModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <Animated.View
          className="bg-white rounded-t-2xl p-4 h-96"
          style={{ transform: [{ translateY }] }}
          {...panResponder.panHandlers}
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <Text className="text-base font-medium text-gray-600">
            Send Query
          </Text>
          <Text className="mt-6 text-gray-500">
            {game.adminName} has been putting efforts to organize this game.
            Please send a query if you have any questions.
          </Text>
          <View className="mt-5 border border-gray-200 rounded-lg p-3 h-48">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Send a query to the host!"
              multiline
              className="text-base flex-1"
            />
            <TouchableOpacity
              onPress={sendQuery}
              className="bg-green-600 p-3 rounded-lg flex-row justify-center items-center gap-2"
            >
              <Text className="text-white text-base font-medium">
                Send Query
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        isVisible={joinModalVisible}
        onBackdropPress={() => setJoinModalVisible(false)}
        onBackButtonPress={() => setJoinModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setJoinModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <Animated.View
          className="bg-white rounded-t-2xl p-4 h-96"
          style={{ transform: [{ translateY }] }}
          {...panResponder.panHandlers}
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <Text className="text-base font-medium text-gray-600">Join Game</Text>
          <Text className="mt-6 text-gray-500">
            {game.adminName} has been putting efforts to organize this game.
            Please send the request if you are quite sure to attend.
          </Text>
          <View className="mt-5 border border-gray-200 rounded-lg p-3 h-48">
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Send a message to the host along with your request!"
              multiline
              className="text-base flex-1"
            />
            <TouchableOpacity
              onPress={sendJoinRequest}
              className="bg-green-600 p-3 rounded-lg flex-row justify-center items-center gap-2"
            >
              <Text className="text-white text-base font-medium">
                Send Request
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default GameDetailsScreen;
