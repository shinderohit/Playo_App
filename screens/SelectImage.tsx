import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserOnboarding } from "../contexts/UserOnboardingContext";

interface ImageItem {
  id: string;
  image: string;
}

const SelectImage = () => {
  const navigation = useNavigation();
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const { image, setImage } = useUserOnboarding();
  const images: ImageItem[] = [
    {
      id: "0",
      image: "https://cdn-icons-png.flaticon.com/128/16683/16683469.png",
    },
    {
      id: "1",
      image: "https://cdn-icons-png.flaticon.com/128/16683/16683439.png",
    },
    {
      id: "2",
      image: "https://cdn-icons-png.flaticon.com/128/4202/4202835.png",
    },
    {
      id: "3",
      image: "https://cdn-icons-png.flaticon.com/128/3079/3079652.png",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-10 items-center">
          <Text className="text-2xl font-bold text-green-600">
            Choose Your Avatar
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            Pick one or upload your own! 📸
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-center mt-10">
          {images.map((avatar) => (
            <Pressable
              key={avatar.id}
              className={`w-20 h-20 m-2 rounded-full overflow-hidden border-2 ${
                image === avatar.image
                  ? "border-green-500"
                  : "border-transparent"
              }`}
              onPress={() => setImage(avatar.image)}
            >
              <Image source={{ uri: avatar.image }} className="w-full h-full" />
            </Pressable>
          ))}
        </View>

        <View className="mt-8 items-center">
          <TextInput
            className="w-4/5 h-12 border border-gray-300 rounded-xl px-4 text-base bg-white mb-3"
            placeholder="Paste image URL (optional)"
            autoCapitalize="none"
            value={image}
            onChangeText={setImage}
          />
          <Text className="text-xs text-gray-500 text-center w-4/5">
            Acceptance rate is 2.5x higher for players with photos
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-6 w-full items-center">
        <Pressable
          onPress={() => navigation.navigate("GameSelection")}
          className={`w-4/5 h-12 rounded-xl items-center justify-center ${
            image ? "bg-green-600" : "bg-green-300"
          }`}
          disabled={!image}
        >
          <Text className="text-white font-semibold text-base">Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SelectImage;
