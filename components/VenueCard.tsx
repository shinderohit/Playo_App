import { Text, View, Pressable, Image } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const VenueCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <View className="mx-4 my-3">
      <Pressable
        onPress={() =>
          navigation.navigate("VenueInfo", {
            name: item.name,
            image: item.newImage,
            sportsAvailable: item.sportsAvailable,
            rating: item.rating,
            timings: item.timings,
            address: item.address,
            location: item.location,
            bookings: item.bookings,
          })
        }
        className="bg-white rounded-t-lg rounded-b-md shadow-sm"
      >
        <Image
          className="w-full h-52 rounded-t-lg"
          source={{ uri: item.image }}
        />

        <View className="px-3 py-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-medium text-black">
              {item.name.length > 40
                ? item.name.substring(0, 40) + "..."
                : item.name}
            </Text>

            <View className="flex-row items-center space-x-1 bg-green-600 px-2.5 py-1 rounded-md">
              <AntDesign name="star" size={16} color="white" />
              <Text className="text-white font-bold text-sm">
                {item.rating}
              </Text>
            </View>
          </View>

          <Text className="text-gray-500 text-sm">
            {item?.address.length > 40
              ? item?.address.substring(0, 40) + "..."
              : item?.address}
          </Text>

          <View className="border border-gray-200 my-3" />

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-black">Upto 10% Off</Text>
            <Text className="text-sm font-medium text-black">
              INR 250 Onwards
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default VenueCard;
