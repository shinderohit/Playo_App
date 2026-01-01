import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Send } from "lucide-react-native";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import { useUser } from "@clerk/clerk-expo";

const { height } = Dimensions.get("window");

interface Chat {
  type: "private" | "group";
  userId?: string;
  gameId?: string;
  name: string;
  admin?: string;
  area?: string;
  date?: string;
  time?: string;
  totalPlayers?: number;
  activityAccess?: string;
  courtNumber?: string;
  lastMessage?: string;
  timestamp?: Date;
}

interface Message {
  _id: string;
  sender: { _id: string; firstName: string; lastName?: string; image?: string };
  content: string;
  timestamp: Date;
  isGroup: boolean;
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const userId = user?.id;
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [tab, setTab] = useState<"playpals" | "groups">("playpals");
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://192.168.0.100:3001", {
        transports: ["websocket"],
      });
      socketRef.current.on("connect", () =>
        console.log("Socket connected:", socketRef.current?.id)
      );
      socketRef.current.on("message", (message: Message) => {
        setMessages((prev) =>
          [...prev, message].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        );
      });
    }

    fetchChats();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("message");
      }
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.100:3001/api/chat/chats",
        {
          params: { userId },
        }
      );
      if (response.data.chats) {
        setChats(response.data.chats);
      } else {
        setChats(response.data);
      }
      filterChats("playpals");
    } catch (err) {
      console.error("Error fetching chats:", err);
      setChats([]);
    }
  };

  const filterChats = (tabType: "playpals" | "groups") => {
    setTab(tabType);
    setFilteredChats(
      chats.filter(
        (chat) => chat.type === (tabType === "playpals" ? "private" : "group")
      )
    );
  };

  const fetchMessages = async (chat: Chat) => {
    try {
      const response = await axios.get(
        "http://192.168.0.100:3001/api/chat/messages",
        {
          params: {
            userId,
            ...(chat.type === "private"
              ? { recipientId: chat.userId }
              : { gameId: chat.gameId }),
          },
        }
      );
      setMessages(response.data || []);
      setSelectedChat(chat);
      if (socketRef.current) {
        socketRef.current.emit("joinRoom", {
          userId,
          ...(chat.type === "private" ? {} : { gameId: chat.gameId }),
        });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat || !socketRef.current) return;

    try {
      await axios.post("http://192.168.0.100:3001/api/chat/send", {
        senderId: userId,
        ...(selectedChat.type === "private"
          ? { recipientId: selectedChat.userId }
          : { gameId: selectedChat.gameId }),
        content: messageText,
        isGroup: selectedChat.type === "group",
      });
      socketRef.current.emit("sendMessage", {
        senderId: userId,
        ...(selectedChat.type === "private"
          ? { recipientId: selectedChat.userId }
          : { gameId: selectedChat.gameId }),
        content: messageText,
        isGroup: selectedChat.type === "group",
      });
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      onPress={() => fetchMessages(item)}
      className="p-4 border-b border-gray-200"
    >
      <Text className="text-lg">{item.name}</Text>
      {item.type === "group" && (
        <View>
          <Text className="text-md">Hosted by: {item.admin}</Text>
          <Text className="text-sm text-gray-500">Location: {item.area}</Text>
          <Text className="text-sm text-gray-500">
            Date: {item.date} at {item.time}
          </Text>
          <Text className="text-sm text-gray-500">
            Players: {item.totalPlayers}
          </Text>
          <Text className="text-sm text-gray-500">
            Access: {item.activityAccess}
          </Text>
          <Text className="text-sm text-gray-500">
            Court: {item.courtNumber || "Not specified"}
          </Text>
        </View>
      )}
      <Text className="text-sm text-gray-500">
        {item.lastMessage || "No messages yet"}
      </Text>
      <Text className="text-xs text-gray-400">
        {moment(item.timestamp).fromNow()}
      </Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`p-2 m-2 rounded-lg ${
        item.sender._id === user?._id
          ? "bg-blue-200 self-end"
          : "bg-gray-200 self-start"
      }`}
    >
      <Text className="text-sm">{`${item.sender.firstName} ${
        item.sender.lastName || ""
      }: ${item.content}`}</Text>
      <Text className="text-xs text-gray-500">
        {moment(item.timestamp).format("h:mm A")}
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-gray-500">
        {tab === "playpals" ? "No playpals available" : "No groups available"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Chats</Text>
        <View className="w-6" />
      </View>
      {!selectedChat && (
        <View className="flex-row justify-around p-2 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => filterChats("playpals")}
            className={`p-2 ${
              tab === "playpals" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            <Text>Playpals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterChats("groups")}
            className={`p-2 ${
              tab === "groups" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            <Text>Groups</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedChat ? (
        <>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            inverted
            className="flex-1 p-4"
            contentContainerStyle={{ paddingBottom: height * 0.1 }}
          />
          <View className="flex-row items-center p-4 bg-white border-t border-gray-200">
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <TouchableOpacity onPress={sendMessage} className="ml-2">
              <Send color="green" size={24} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.userId || item.gameId || ""}
          className="flex-1"
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;
