import { Tabs } from "expo-router";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import LoginScreen from "../login";

export default function Layout() {
  // Ordna log in senare
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
        </Text>
        <TouchableOpacity>
          <FontAwesome5 name="user-circle" size={26} color="#bfa76a" />
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#bfa76a",
          tabBarInactiveTintColor: "#e0e0d6",
          tabBarStyle: {
            backgroundColor: "#18191a",
            borderTopWidth: 3,
            borderTopColor: "#bfa76a", //Borde bli guld?

            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: "serif",
            fontWeight: "bold",
            fontSize: 13,
            letterSpacing: 0.5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Start",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="compass" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            tabBarLabel: "Karta",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="map-search-outline"
                size={size - 2}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="scoreboard"
          options={{
            tabBarLabel: "Scoreboard",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="crown" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            tabBarLabel: "Konto",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="book-open-variant"
                size={size - 2}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

// Inloggninsmodal

// const styles = StyleSheet.create({
//   modalOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(24,25,26,0.98)", // mörk bakgrund
//     zIndex: 100,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
