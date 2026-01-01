import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar,
  Users,
  Wallet,
  Settings,
  Gift,
  Book,
  Share2,
  HelpCircle,
  LogOut,
  Edit,
} from "lucide-react-native";
import { useUserStore } from "../stores/userStore";
import { useClerk } from "@clerk/clerk-expo";

const ProfileScreen: React.FC = () => {
  const { user } = useUserStore();
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign-out error:", JSON.stringify(err, null, 2));
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="bg-[#294461] p-4 pb-8">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: user?.image || "https://i.pravatar.cc/100" }}
                className="w-16 h-16 rounded-full mr-4"
              />
              <View>
                <Text className="text-white text-xl font-bold">
                  {user?.firstName}
                </Text>
                <Text className="text-white text-sm">150 Karma Points</Text>
              </View>
            </View>
            <TouchableOpacity className="p-2">
              <Edit color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-4">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Calendar color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  My Bookings
                </Text>
                <Text className="text-gray-500 text-sm">
                  View Transactions & Receipts
                </Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Users color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Playpals
                </Text>
                <Text className="text-gray-500 text-sm">
                  View & Manage Players
                </Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Wallet color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Passbook
                </Text>
                <Text className="text-gray-500 text-sm">
                  Manage Karma, Playo Credits, etc
                </Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Settings color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Preference and Privacy
                </Text>
                <Text className="text-gray-500 text-sm">
                  Manage Your Settings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-4 mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Gift color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Offers
                </Text>
                <Text className="text-gray-500 text-sm">
                  View Available Discounts
                </Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Book color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Blogs
                </Text>
                <Text className="text-gray-500 text-sm">
                  Read Latest Articles
                </Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <Share2 color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Invite & Earn
                </Text>
                <Text className="text-gray-500 text-sm">
                  Refer Friends for Rewards
                </Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity className="flex-row items-center py-3">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <HelpCircle color="green" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-semibold">
                  Help & Support
                </Text>
                <Text className="text-gray-500 text-sm">Get Assistance</Text>
              </View>
            </TouchableOpacity>
            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity
              onPress={handleSignOut}
              className="flex-row items-center py-3"
            >
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                <LogOut color="red" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-red-600 text-base font-semibold">
                  Logout
                </Text>
                <Text className="text-gray-500 text-sm">
                  Sign Out of Your Account
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
