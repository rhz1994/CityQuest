import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { colors } from "../../styles/tokens";
import { useLanguage } from "../../context/LanguageContext";
// import { useAuth } from "../../context/AuthContext";
// import LoginScreen from "../login";

export default function Layout() {
  const router = useRouter();
  const { t } = useLanguage();
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
          backgroundColor: colors.bgSurface,
          paddingTop: 38, // för statusbar
          paddingBottom: 10,
          paddingHorizontal: 18,
          borderBottomWidth: 2,
          borderBottomColor: colors.accentGold,
        }}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t("topbar.menu")}
          onPress={() =>
            Alert.alert(
              t("topbar.menuSoonTitle"),
              t("topbar.menuSoonBody"),
            )
          }
        >
          <Ionicons name="menu" size={28} color={colors.accentGold} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.accentGold,
            fontFamily: "serif",
            fontSize: 22,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          CityQuest
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t("topbar.account")}
          onPress={() => router.navigate("/(tabs)/account")}
        >
          <FontAwesome5 name="user-circle" size={26} color={colors.accentGold} />
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accentGold,
          tabBarInactiveTintColor: colors.textPrimary,
          tabBarStyle: {
            backgroundColor: colors.bgSurface,
            borderTopWidth: 3,
            borderTopColor: colors.accentGold,

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
            tabBarLabel: t("tabs.home"),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="compass" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            tabBarLabel: t("tabs.map"),
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
            tabBarLabel: t("tabs.scoreboard"),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="crown" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            tabBarLabel: t("tabs.account"),
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
