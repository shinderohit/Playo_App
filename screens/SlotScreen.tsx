import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import axios from "axios";
import moment from "moment";
import { useUser } from "@clerk/clerk-expo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Court {
  id: string;
  name: string;
  number: number;
}

interface Sport {
  id: string;
  name: string;
  icon: string;
  price: number;
  courts: Court[];
}

interface Booking {
  courtNumber: string;
  date: string;
  time: string;
  user: string;
  sport: string;
  game: string;
}

interface Venue {
  _id: string;
  name: string;
  sportsAvailable: Sport[];
  bookings: Booking[];
  image: string;
  rating: number;
  address: string;
}

interface RouteParams {
  place: string;
  sports: Sport[];
  bookings: Booking[];
  gameId?: string;
}

const SlotScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    place,
    sports,
    bookings: initialBookings,
    gameId,
  } = route.params as RouteParams;
  const { user } = useUser();
  const userId = user?.id;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(sports[0]?.name || "");
  const [selectedDate, setSelectedDate] = useState(moment().format("Do MMMM"));
  const [selectedTime, setSelectedTime] = useState("5:00 AM");
  const [duration, setDuration] = useState(30);
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [currentGameId, setCurrentGameId] = useState<string | null>(
    gameId || null
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const TIME_SLOTS = Array.from({ length: 37 }, (_, i) => {
    const hour = 5 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const ampm = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute} ${ampm}`;
  });

  const AVAILABILITY = TIME_SLOTS.map((time, index) => {
    const slotMoment = moment(`${selectedDate} ${time}`, "Do MMMM h:mm A");
    const currentMoment = moment();

    if (slotMoment.isBefore(currentMoment)) return 0;

    const slotEnd = moment(slotMoment)
      .add(duration, "minutes")
      .format("h:mm A");
    const slotTimeRange = { start: time, end: slotEnd };

    const isBooked = venue?.bookings.some((booking) => {
      const [bookingStart, bookingEnd] = booking.time.split(" - ");
      const bookingStartMoment = moment(
        `${booking.date} ${bookingStart}`,
        "Do MMMM h:mm A"
      );
      const bookingEndMoment = moment(
        `${booking.date} ${bookingEnd}`,
        "Do MMMM h:mm A"
      );
      const selectedSlotStartMoment = moment(
        `${selectedDate} ${time}`,
        "Do MMMM h:mm A"
      );
      const selectedSlotEndMoment = moment(
        `${selectedDate} ${slotEnd}`,
        "Do MMMM h:mm A"
      );

      return (
        booking.date === selectedDate &&
        booking.sport === selectedSport &&
        selectedSlotStartMoment.isBefore(bookingEndMoment) &&
        selectedSlotEndMoment.isAfter(bookingStartMoment) &&
        venue.sportsAvailable
          .find((s) => s.name === selectedSport)
          ?.courts.some(
            (court) => court.number.toString() === booking.courtNumber
          )
      );
    });

    return isBooked ? 2 : 1;
  });

  const DATES = Array.from({ length: 5 }, (_, i) => {
    const dateMoment = moment().add(i, "days");
    return {
      day: dateMoment.format("D"),
      month: dateMoment.format("MMM"),
      weekday: dateMoment.format("ddd"),
      fullDate: dateMoment.format("Do MMMM"),
    };
  });

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://192.168.0.100:3001/api/venues",
          {
            params: { name: place },
          }
        );
        const venues = response.data;
        if (venues.length === 0) {
          throw new Error("Venue not found");
        }
        setVenue(venues[0]);
      } catch (error: any) {
        console.error("Failed to fetch venue:", error.message);
        Alert.alert("Error", "Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [place]);

  useEffect(() => {
    const createNewGame = async () => {
      if (!userId || currentGameId) return;

      try {
        const response = await axios.post(
          "http://192.168.0.100:3001/api/games/create",
          {
            sport: selectedSport,
            area: place,
            date: selectedDate,
            time: `${selectedTime} - ${moment(selectedTime, "h:mm A")
              .add(duration, "minutes")
              .format("h:mm A")}`,
            admin: userId,
            totalPlayers: 1,
            activityAccess: "public",
          }
        );
        setCurrentGameId(response.data._id);
      } catch (error: any) {
        console.error("Failed to create game:", error.message);
        Alert.alert("Error", "Failed to create game for booking");
      }
    };

    createNewGame();
  }, [userId, selectedSport, place, selectedDate, selectedTime, duration]);

  useEffect(() => {
    const timeIndex = TIME_SLOTS.indexOf(selectedTime);
    if (timeIndex !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: timeIndex * 50,
        animated: false,
      });
    }
  }, [selectedTime]);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const slotWidth = 50;
    const index = Math.round(scrollOffset / slotWidth);
    const newTimeIndex = index % 2 === 0 ? index : index - 1;
    const newTime = TIME_SLOTS[newTimeIndex] || TIME_SLOTS[0];
    setSelectedTime(newTime);

    scrollViewRef.current?.scrollTo({
      x: newTimeIndex * slotWidth,
      animated: true,
    });
  };

  const adjustDuration = (change: number) => {
    const newDuration = Math.max(30, duration + change);
    setDuration(newDuration);
  };

  const handleCourtSelection = (courtNumber: string, courtName: string) => {
    const timeIndex = TIME_SLOTS.indexOf(selectedTime);
    if (AVAILABILITY[timeIndex] === 2) {
      Alert.alert(
        "Error",
        "This court is already booked for the selected time."
      );
      return;
    }
    setSelectedCourt(courtNumber);
    setConfirmationMessage(`${duration} min added`);
    setTimeout(() => setConfirmationMessage(null), 2000);
  };

  const handleCheckout = async () => {
    if (!selectedCourt) {
      Alert.alert("Error", "Please select a court");
      return;
    }

    if (AVAILABILITY[TIME_SLOTS.indexOf(selectedTime)] !== 1) {
      Alert.alert("Error", "Selected time slot is not available");
      return;
    }

    if (!currentGameId) {
      Alert.alert("Error", "Game not created. Please try again.");
      return;
    }

    const slotEnd = moment(selectedTime, "h:mm A")
      .add(duration, "minutes")
      .format("h:mm A");
    const slotTime = `${selectedTime} - ${slotEnd}`;

    try {
      const sport = venue?.sportsAvailable.find((s) =>
        s.courts.some((c) => c.number.toString() === selectedCourt)
      );
      if (!sport) {
        Alert.alert("Error", "Selected court not found");
        return;
      }

      const response = await axios.post(
        `http://192.168.0.100:3001/api/games/${currentGameId}/book`,
        {
          userId,
          venueName: venue?.name,
          courtNumber: selectedCourt,
          date: selectedDate,
          time: slotTime,
          sport: selectedSport,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Success",
          `Slot booked successfully for ${
            sport.courts.find((c) => c.number.toString() === selectedCourt)
              ?.name
          } on ${selectedDate} at ${slotTime}`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to book slot:",
        error.message,
        error.response?.data
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to book slot"
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!venue) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-gray-500 text-lg">Venue not found</Text>
      </SafeAreaView>
    );
  }

  const selectedSportData = venue.sportsAvailable.find(
    (s) => s.name === selectedSport
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-white border-b border-gray-200 p-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="black" size={24} />
          </TouchableOpacity>
          <Text className="text-gray-800 text-lg font-semibold">
            {venue.name}
          </Text>
          <View className="w-6" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="bg-[#294461] p-4">
          <Text className="text-white text-sm">{venue.address}</Text>
          <Text className="mt-4 text-white text-base">
            Earn 3 karma points on every booking!
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-center p-4">
          {venue.sportsAvailable.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              className={`px-4 py-2 m-1 rounded-full border border-gray-300 ${
                selectedSport === sport.name ? "bg-gray-200" : "bg-white"
              }`}
              onPress={() => {
                setSelectedSport(sport.name);
                setSelectedCourt(null);
                setConfirmationMessage(null);
              }}
            >
              <Text className="text-base text-gray-800">{sport.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-around p-4">
          {DATES.map((d, index) => (
            <TouchableOpacity
              key={d.fullDate}
              className={`p-3 rounded-lg items-center ${
                selectedDate === d.fullDate ? "bg-green-500" : "bg-gray-200"
              }`}
              onPress={() => {
                setSelectedDate(d.fullDate);
                setSelectedCourt(null);
                setConfirmationMessage(null);
              }}
            >
              <Text
                className={`text-base font-semibold ${
                  selectedDate === d.fullDate ? "text-white" : "text-gray-800"
                }`}
              >
                {d.month} {d.day}
              </Text>
              <Text
                className={`text-sm ${
                  selectedDate === d.fullDate ? "text-white" : "text-gray-600"
                }`}
              >
                {d.weekday}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-semibold text-gray-800">TIME</Text>
            <View className="flex-row items-center">
              <Text className="text-base font-semibold text-gray-800 mr-2">
                DURATION
              </Text>
              <View className="flex-row items-center bg-white p-2 rounded-lg border border-gray-300">
                <TouchableOpacity onPress={() => adjustDuration(-30)}>
                  <Text className="text-xl text-gray-800 px-2">–</Text>
                </TouchableOpacity>
                <Text className="text-base text-gray-800 mx-2">
                  {duration} min
                </Text>
                <TouchableOpacity onPress={() => adjustDuration(30)}>
                  <Text className="text-xl text-gray-800 px-2">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="relative">
            <View className="absolute left-1/2 -ml-2.5 top-0 z-10">
              <View className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-800 mb-0.5" />
            </View>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              snapToInterval={100}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: SCREEN_WIDTH / 2 - 25,
              }}
            >
              {TIME_SLOTS.map((time, index) => (
                <View
                  key={time}
                  className="w-[50px] items-center justify-center"
                >
                  <View
                    className="w-full h-1.5 absolute top-2.5"
                    style={{
                      backgroundColor:
                        AVAILABILITY[index] === 0
                          ? "#D3D3D3"
                          : AVAILABILITY[index] === 2
                          ? "#D3D3D3"
                          : "#00b562",
                    }}
                  />
                  {index % 2 === 0 && (
                    <Text className="text-xs text-gray-800 mt-6 text-center w-[50px]">
                      {time}
                    </Text>
                  )}
                  {index % 2 === 0 ? (
                    <View className="w-0.5 h-2.5 bg-gray-800 mt-8 items-center">
                      <View className="w-1.5 h-1.5 bg-gray-800 rounded-full -mt-0.5" />
                    </View>
                  ) : (
                    <View className="w-0.25 h-1.25 bg-gray-600 mt-8" />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-4 flex-row flex-wrap">
          {selectedSportData?.courts.map((court) => {
            const isCourtBooked = venue?.bookings.some((booking) => {
              const [bookingStart, bookingEnd] = booking.time.split(" - ");
              const bookingStartMoment = moment(
                `${booking.date} ${bookingStart}`,
                "Do MMMM h:mm A"
              );
              const bookingEndMoment = moment(
                `${booking.date} ${bookingEnd}`,
                "Do MMMM h:mm A"
              );
              const selectedSlotStartMoment = moment(
                `${selectedDate} ${selectedTime}`,
                "Do MMMM h:mm A"
              );
              const selectedSlotEndMoment = moment(
                `${selectedDate} ${moment(selectedTime, "h:mm A")
                  .add(duration, "minutes")
                  .format("h:mm A")}`,
                "Do MMMM h:mm A"
              );
              return (
                booking.date === selectedDate &&
                booking.sport === selectedSport &&
                selectedSlotStartMoment.isBefore(bookingEndMoment) &&
                selectedSlotEndMoment.isAfter(bookingStartMoment) &&
                court.number.toString() === booking.courtNumber
              );
            });

            return (
              <TouchableOpacity
                key={court.id}
                className={`w-1/2 p-4 mb-2 border border-gray-200 rounded-lg ${
                  selectedCourt === court.number.toString()
                    ? "bg-green-100"
                    : isCourtBooked
                    ? "bg-gray-300"
                    : "bg-white"
                } ${court.id % 2 === 0 ? "pr-2" : "pl-4"} ${
                  isCourtBooked ? "opacity-50" : ""
                }`}
                onPress={() =>
                  !isCourtBooked &&
                  handleCourtSelection(court.number.toString(), court.name)
                }
                disabled={isCourtBooked}
              >
                <Text className="text-sm text-gray-800">{court.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSportData && (
          <View className="items-center py-4">
            <Text className="text-lg font-semibold text-gray-800">
              INR {selectedSportData.price.toFixed(2)}
            </Text>
          </View>
        )}

        {confirmationMessage && (
          <View className="absolute bottom-4 left-0 right-0 items-center">
            <View className="bg-green-600 px-4 py-2 rounded-lg">
              <Text className="text-white text-base font-semibold">
                {confirmationMessage}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        className="bg-green-600 p-3 mt-3 rounded-sm"
        onPress={handleCheckout}
      >
        <Text className="text-center text-white text-base font-semibold">
          BOOK SLOT
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SlotScreen;
