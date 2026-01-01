import { View, Text, Image, Pressable, ScrollView } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const StartScreen = () => {
  const navigation = useNavigation();
  const mapView = useRef(null);

  const users = [
    {
      image:
        "https://images.pexels.com/photos/7208625/pexels-photo-7208625.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Hey!",
    },
    {
      image:
        "https://images.pexels.com/photos/2913125/pexels-photo-2913125.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "let's play",
    },
    {
      image:
        "https://images.pexels.com/photos/1042140/pexels-photo-1042140.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "I'm always",
    },
    {
      image:
        "https://images.pexels.com/photos/4307678/pexels-photo-4307678.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "At 8pm?",
    },
    {
      image:
        "https://images.pexels.com/photos/1379031/pexels-photo-1379031.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Hey!",
    },
    {
      image:
        "https://images.pexels.com/photos/3264235/pexels-photo-3264235.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "What up?",
    },
  ];

  const BANGALORE_COORDS = {
    latitude: 12.9916987,
    longitude: 77.5945627,
  };

  const generateCicularPoints = (center, radius, numPoints) => {
    const points = [];
    const angleStep = (2 * Math.PI) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const latitude = center.latitude + (radius / 111) * Math.cos(angle);
      const longitude =
        center.longitude +
        (radius / (111 * Math.cos(center.latitude))) * Math.sin(angle);
      points.push({ latitude, longitude });
    }

    return points;
  };

  const circularPoints = generateCicularPoints(BANGALORE_COORDS, 5, 6);

  useEffect(() => {
    mapView.current.fitToCoordinates(circularPoints, {
      edgePadding: {
        top: 70,
        bottom: 70,
        left: 70,
        right: 70,
      },
    });
  }, []);

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <MapView
          ref={mapView}
          style={{ width: "100%", height: 400 }}
          initialRegion={{
            latitude: BANGALORE_COORDS.latitude,
            longitude: BANGALORE_COORDS.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {circularPoints.map((point, index) => {
            const user = users[index % users.length];
            return (
              <Marker key={index} coordinate={point}>
                <View className="items-center justify-center">
                  <Image
                    source={{ uri: user.image }}
                    className="w-[70px] h-[70px] rounded-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="bg-white px-3 py-2 rounded-md mt-1">
                  <Text className="text-sm font-medium text-center">
                    {user.description}
                  </Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        <View className="mt-10 items-center justify-center">
          <Text className="text-xl font-semibold text-center w-1/2">
            Find Player in your neighbourhood
          </Text>
          <Text className="text-gray-500 text-base mt-5">
            Just like you did as a Kid!
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("SignIn")}
          className="mt-10 items-center justify-center"
        >
          <Text className="text-base text-gray-500">
            Already have an account? Login
          </Text>
        </Pressable>

        <View className="items-center justify-center mt-6">
          <Image
            source={{
              uri: "https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50",
            }}
            className="w-[110px] h-[60px]"
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      <View className="bg-white p-6">
        <Pressable
          onPress={() => navigation.navigate("Name")}
          className="bg-green-500 py-3 rounded-lg"
        >
          <Text className="text-white text-base font-medium text-center">
            READY, SET, GO
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default StartScreen;
