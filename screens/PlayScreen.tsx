import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  MessageCircle,
  Filter,
  SlidersHorizontal,
} from "lucide-react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import moment from "moment";
import GameCard from "../components/GameCard";
import CalendarGameCard from "../components/CalendarGameCard";
import { useUserStore } from "../stores/userStore";

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
  isInProgress?: boolean;
  createdAt?: Date;
  userRequestStatus?: string;
}

const PlayScreen: React.FC = () => {
  const route = useRoute();
  const [selectedCategory, setSelectedCategory] = useState<
    "Calendar" | "Recommended" | "My Sports" | "Other Sports" | "Past Games"
  >(route.params?.initialTab === "Calendar" ? "Calendar" : "My Sports");
  const [selectedSport, setSelectedSport] = useState("All");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useUser();
  const { user: userData } = useUserStore();
  const { refreshUser } = useUserStore();
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const fetchGames = useCallback(async () => {
    console.log(
      "Fetching games - selectedCategory:",
      selectedCategory,
      "userId:",
      user?.id
    );
    if (!user?.id && selectedCategory === "Calendar") {
      console.log("No user ID for Calendar, skipping fetch");
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let endpoint: string;
    let params: { userId?: string } = {};

    if (selectedCategory === "Calendar") {
      endpoint = "http://192.168.0.100:3001/api/games/upcoming";
      params = { userId: user?.id };
    } else if (selectedCategory === "Recommended") {
      console.log("Recommended category selected, no games to fetch");
      setGames([]);
      setLoading(false);
      return;
    } else {
      endpoint = "http://192.168.0.100:3001/api/games/games";
    }

    try {
      console.log(`Fetching games from: ${endpoint} with params:`, params);
      const response = await axios.get(endpoint, { params });
      console.log("API response:", JSON.stringify(response.data, null, 2));
      setGames(response.data);
    } catch (error: any) {
      console.error(
        `Failed to fetch games for ${selectedCategory}:`,
        error.message,
        error.response?.data
      );
      setGames([]);
      alert(`Failed to fetch games: ${error.message}`);
    } finally {
      setLoading(false);
      setNeedsRefresh(false);
    }
  }, [selectedCategory, user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchGames();
    }, [fetchGames])
  );

  useEffect(() => {
    fetchGames();
  }, [fetchGames, selectedCategory, user?.id]);

  useEffect(() => {
    if (needsRefresh || route.params?.refresh || games.length === 0) {
      fetchGames();
    }

    const intervalId = setInterval(() => checkCompletedGames(games), 60000);
    return () => clearInterval(intervalId);
  }, [fetchGames, needsRefresh, games.length, route.params?.refresh]);

  const checkCompletedGames = useCallback(
    async (gameList: Game[]) => {
      const now = moment();
      const completedGames = gameList.filter((game) => {
        const [startTime, endTime] = game.time.split(" - ");
        const gameEndTime = moment(
          `${moment(game.date, "Do MMMM", true).format(
            "YYYY-MM-DD"
          )} ${endTime}`,
          "YYYY-MM-DD h:mm A"
        );
        return gameEndTime.isValid() && gameEndTime.isBefore(now);
      });

      if (completedGames.length > 0) {
        const playerClerkIds = completedGames.flatMap(
          (game) => game.players.map((player) => player._id) || [user?.id]
        );
        try {
          await axios.post(
            "http://192.168.0.100:3001/api/users/update-game-stats",
            { playerClerkIds }
          );
          if (user?.id) {
            await refreshUser(user.id);
          }
        } catch (error) {
          console.error("Failed to update game stats:", error);
        }
      }
    },
    [user?.id, refreshUser]
  );

  const filteredGames = useMemo(
    () =>
      selectedSport === "All"
        ? games
        : games.filter((game) => game.sport === selectedSport),
    [games, selectedSport]
  );

  const displayGames = useMemo(() => {
    const now = moment();
    if (selectedCategory === "Past Games") {
      return filteredGames.filter((game) => {
        const gameDate = moment(game.date, "Do MMMM", true);
        if (!gameDate.isValid()) {
          console.warn(
            `Invalid date format for game ${game._id}: ${game.date}`
          );
          return false;
        }
        const gameTime = game.time.split(" - ")[0];
        const gameDateTime = moment(
          `${gameDate.format("YYYY-MM-DD")} ${gameTime}`,
          "YYYY-MM-DD h:mm A"
        );
        return gameDateTime.isBefore(now);
      });
    } else if (selectedCategory === "Calendar") {
      return filteredGames
        .filter((game) => {
          const [startTime, endTime] = game.time.split(" - ");
          const gameStartTime = moment(
            `${moment(game.date, "Do MMMM", true).format(
              "YYYY-MM-DD"
            )} ${startTime}`,
            "YYYY-MM-DD h:mm A"
          );
          const gameEndTime = moment(
            `${moment(game.date, "Do MMMM", true).format(
              "YYYY-MM-DD"
            )} ${endTime}`,
            "YYYY-MM-DD h:mm A"
          );
          return (
            gameEndTime.isAfter(now) ||
            (gameStartTime.isBefore(now) && gameEndTime.isAfter(now))
          );
        })
        .sort((a, b) => {
          const aStart = moment(
            `${moment(a.date, "Do MMMM", true).format("YYYY-MM-DD")} ${
              a.time.split(" - ")[0]
            }`,
            "YYYY-MM-DD h:mm A"
          );
          const bStart = moment(
            `${moment(b.date, "Do MMMM", true).format("YYYY-MM-DD")} ${
              b.time.split(" - ")[0]
            }`,
            "YYYY-MM-DD h:mm A"
          );
          return aStart.isBefore(bStart) ? -1 : 1;
        });
    } else if (selectedCategory === "My Sports") {
      return filteredGames.sort(
        (a, b) =>
          (b.createdAt ? new Date(b.createdAt) : 0) -
          (a.createdAt ? new Date(a.createdAt) : 0)
      );
    }
    return filteredGames;
  }, [filteredGames, selectedCategory]);

  const handleCreateGame = () => {
    navigation.navigate("CreateActivity", { refresh: true });
    setNeedsRefresh(true);
  };

  const handleCancelRequest = () => {
    setNeedsRefresh(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-[#1f2937] pb-3">
        <View className="px-4 pt-3 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-300 text-sm">
              {moment().format("h:mm A")}
            </Text>
            <Text className="text-white text-lg font-semibold">
              Sahakar Nagar, Bengaluru
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MessageCircle color="white" size={22} />
            <Bell color="white" size={22} />
            <Image
              source={{ uri: userData?.image || "https://i.pravatar.cc/100" }}
              className="w-9 h-9 rounded-full"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 px-4"
        >
          {[
            "Calendar",
            "Recommended",
            "My Sports",
            "Other Sports",
            "Past Games",
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="mr-6"
              onPress={() => {
                if (item === "Recommended") {
                  alert("Recommended feature is not available yet.");
                  return;
                }
                setSelectedCategory(item);
              }}
              disabled={item === "Recommended"}
            >
              <Text
                className={`text-base font-bold ${
                  selectedCategory === item
                    ? "text-green-400"
                    : item === "Recommended"
                    ? "text-gray-500"
                    : "text-white"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 px-4"
        >
          {[
            { name: "All", icon: "🌐" },
            { name: "Badminton", icon: "🏸️" },
            { name: "Cricket", icon: "🏏" },
            { name: "Cycling", icon: "🚴" },
            { name: "Running", icon: "🏃" },
            { name: "Football", icon: "⚽" },
          ].map((sport, index) => (
            <TouchableOpacity
              key={index}
              className={`mr-3 px-4 py-2 rounded-full flex-row items-center gap-2 ${
                selectedSport === sport.name
                  ? "bg-green-500"
                  : "bg-white border border-gray-200"
              }`}
              onPress={() => setSelectedSport(sport.name)}
            >
              <Text className="text-lg">{sport.icon}</Text>
              <Text
                className={`text-base font-semibold ${
                  selectedSport === sport.name ? "text-white" : "text-gray-800"
                }`}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="bg-white px-4 py-3 flex-row justify-between items-center border-b border-gray-200">
        <TouchableOpacity
          onPress={handleCreateGame}
          className="bg-gray-100 px-4 py-2 rounded-xl"
        >
          <Text className="text-base font-semibold text-gray-800">
            + Create Game
          </Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity>
            <SlidersHorizontal size={22} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Filter size={22} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="px-4 pt-4">
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#1f2937" />
          </View>
        ) : displayGames.length === 0 ? (
          <View className="mt-10 items-center justify-center">
            <Text className="text-gray-500 text-lg font-medium">
              No games available under "{selectedCategory}"
            </Text>
          </View>
        ) : (
          displayGames.map((game, idx) =>
            selectedCategory === "Calendar" ? (
              <CalendarGameCard
                key={game._id}
                game={game}
                onCancelRequest={handleCancelRequest}
              />
            ) : (
              <GameCard key={game._id} game={game} />
            )
          )
        )}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayScreen;
