import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

const cities = ["Gothenburg"];

export default function HomeScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.cityButton}
      onPress={() => router.push({ pathname: "/city", params: { city: item } })}
    >
      <Text style={styles.cityButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your city</Text>
      <FlatList
        data={cities}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
    paddingTop: 40,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
  },
  cityButton: {
    backgroundColor: "#ca8a04",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: 240,
    alignItems: "center",
  },
  cityButtonText: { color: "#1f2937", fontWeight: "700", fontSize: 18 },
});
