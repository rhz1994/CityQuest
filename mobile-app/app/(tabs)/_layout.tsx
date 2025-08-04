import { Tabs } from "expo-router";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useAuth } from "../../context/AuthContext";
import LoginScreen from "../login";

export default function Layout() {
  // const { user } = useAuth();

  // if (!user) {
  //   // Visa login som helsida ovanpå ALLT
  //   return <LoginScreen />;
  // }
  return (
    <>
      {/* Topbar och tabs visas bara om inloggad */}
      {/* Topbar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#18191a",
          paddingTop: 38, // för statusbar
          paddingBottom: 10,
          paddingHorizontal: 18,
          borderBottomWidth: 2,
          borderBottomColor: "#bfa76a",
        }}
      >
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#bfa76a" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#bfa76a",
            fontFamily: "serif",
            fontSize: 22,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          CityQuest
        </Text>{" "}
        <TouchableOpacity>
          <FontAwesome5 name="user-circle" size={26} color="#bfa76a" />{" "}
        </TouchableOpacity>
      </View>
    </>
  );
}
