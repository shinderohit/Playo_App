import React, { useState, useEffect } from "react";
import { Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Modal from "react-native-modal";
import moment from "moment";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

const CreateActivityScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [modalVisible, setModalVisible] = useState(false);
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [timeInterval, setTimeInterval] = useState("");
  const [selected, setSelected] = useState("Public");
  const [noOfPlayers, setNoOfPlayers] = useState("");
  const [taggedVenue, setTaggedVenue] = useState(null);
  const { user } = useUser();

  console.log("ysr", user);

  const handleVenueSelected = (venue) => {
    setTaggedVenue(venue);
  };

  const handleTimeSelected = (interval) => {
    setTimeInterval(interval);
  };

  const generateDates = () => {
    return Array.from({ length: 10 }).map((_, i) => {
      const date = moment().add(i, "days");
      return {
        id: i.toString(),
        displayDate:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : i === 2
            ? "Day after"
            : date.format("Do MMMM"),
        dayOfWeek: date.format("dddd"),
        actualDate: date.format("Do MMMM"),
      };
    });
  };

  const dates = generateDates();

  const createGame = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.100:3001/api/games/create",
        {
          sport,
          area: taggedVenue?.name,
          date,
          time: timeInterval,
          admin: user?.id,
          totalPlayers: noOfPlayers,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success!", "Game created successfully", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => navigation.goBack() },
        ]);

        setSport("");
        setDate("");
        setTimeInterval("");
        setNoOfPlayers("");
        setTaggedVenue(null);
      }
    } catch (err) {
      console.error(
        "Failed to create game:",
        err.response?.data || err.message
      );
      Alert.alert("Error", "Failed to create game. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4">
        <Pressable onPress={() => navigation.goBack()} className="py-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        <Text className="text-2xl font-bold mt-2">Create Activity</Text>

        <Pressable
          onPress={() => navigation.navigate("Sport")}
          className="flex-row items-center gap-4 mt-6"
        >
          <MaterialCommunityIcons name="whistle" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Sport</Text>
            <TextInput
              value={sport}
              onChangeText={setSport}
              placeholder="Eg Badminton / Football / Cricket"
              placeholderTextColor="gray"
              className="mt-1 text-base"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        <Pressable
          onPress={() =>
            navigation.navigate("TagVenue", {
              onVenueSelected: handleVenueSelected,
            })
          }
          className="flex-row items-center gap-4"
        >
          <Entypo name="location" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Area</Text>
            <TextInput
              value={taggedVenue?.name || ""}
              editable={false}
              placeholder="Locality or venue name"
              placeholderTextColor="gray"
              className="mt-1 text-base text-black"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center gap-4"
        >
          <Feather name="calendar" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Date</Text>
            <TextInput
              editable={false}
              value={date}
              placeholder="Pick a Day"
              placeholderTextColor="gray"
              className="mt-1 text-base text-black"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        <Pressable
          onPress={() =>
            navigation.navigate("SelectTime", {
              onTimeSelected: handleTimeSelected,
            })
          }
          className="flex-row items-center gap-4"
        >
          <AntDesign name="clockcircleo" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Time</Text>
            <TextInput
              value={timeInterval}
              editable={false}
              placeholder="Pick Exact Time"
              placeholderTextColor="gray"
              className="mt-1 text-base text-black"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        <Text className="text-lg font-medium mt-4 mb-2">Activity Access</Text>
        <View className="flex-row gap-4">
          {["Public", "invite only"].map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelected(type)}
              className={`flex-row items-center justify-center px-4 py-2 rounded-md w-36 ${
                selected === type
                  ? "bg-green-600"
                  : "bg-white border border-gray-300"
              }`}
            >
              {type === "Public" ? (
                <Ionicons
                  name="earth"
                  size={24}
                  color={selected === type ? "white" : "black"}
                />
              ) : (
                <AntDesign
                  name="lock1"
                  size={24}
                  color={selected === type ? "white" : "black"}
                />
              )}
              <Text
                className={`ml-2 text-base font-bold ${
                  selected === type ? "text-white" : "text-black"
                }`}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-base font-medium mt-6">Total Players</Text>
        <TextInput
          value={noOfPlayers}
          onChangeText={setNoOfPlayers}
          keyboardType="numeric"
          className="mt-2 p-3 bg-white border border-gray-300 rounded-md"
          placeholder="Total Players (including you)"
        />

        <Text className="text-base font-medium mt-6">Add Instructions</Text>
        <View className="bg-gray-100 p-4 rounded-md mt-2 space-y-3">
          {[
            {
              icon: "bag-check",
              text: "Bring your own equipment",
              color: "red",
            },
            { icon: "directions-fork", text: "Cost Shared", color: "#FEBE10" },
            {
              icon: "syringe",
              text: "Covid Vaccinated players preferred",
              color: "green",
            },
          ].map(({ icon, text, color }, idx) => (
            <View key={idx} className="flex-row items-center gap-2">
              {icon === "syringe" ? (
                <FontAwesome5 name={icon} size={20} color={color} />
              ) : (
                <MaterialCommunityIcons name={icon} size={24} color={color} />
              )}
              <Text className="flex-1 text-base font-medium">{text}</Text>
              <FontAwesome name="check-square" size={20} color="green" />
            </View>
          ))}
          <TextInput
            className="p-3 bg-white border border-gray-300 rounded-md"
            placeholder="Add Additional Instructions"
          />
        </View>

        <Pressable
          className="bg-green-600 mt-8 py-3 rounded-md"
          onPress={createGame}
        >
          <Text className="text-white text-center font-semibold text-base">
            Create Activity
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-white rounded-t-2xl p-4 max-h-[75%]">
          <Text className="text-center text-lg font-bold py-2">
            Choose date/time to host
          </Text>
          <View className="flex-row flex-wrap gap-3 px-2">
            {dates.map((date) => (
              <Pressable
                key={date.id}
                onPress={() => {
                  setDate(date.actualDate);
                  setModalVisible(false);
                }}
                className="w-[30%] border border-gray-300 rounded-md items-center py-2"
              >
                <Text>{date.displayDate}</Text>
                <Text className="text-gray-500 mt-1 text-sm">
                  {date.dayOfWeek}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateActivityScreen;
