import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Quest = {
  questId: number;
  questName: string;
  questShortDescription: string;
};

export default function CityScreen() {
  const params = useLocalSearchParams();
  const city = Array.isArray(params.city) ? params.city[0] : params.city;
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!city) return;
    fetch(`http://192.168.1.110:5000/quests/city/${city}`)
      .then((res) => res.json())
      .then((data) => {
        setQuests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  const renderItem = ({ item }: { item: Quest }) => (
    <TouchableOpacity
      style={styles.questButton}
      onPress={() =>
        router.push({ pathname: "/quest", params: { questId: item.questId } })
      }
    >
      <Text style={styles.questName}>{item.questName}</Text>
      <Text style={styles.questDesc}>{item.questShortDescription}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quests in {city}</Text>
      {loading ? (
        <ActivityIndicator color="#FFD700" size="large" />
      ) : (
        <FlatList
          data={quests}
          renderItem={renderItem}
          keyExtractor={(item) => item.questId.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 20,
  },
  questButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: 320,
    maxWidth: "100%",
  },
  questName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1f2937",
    marginBottom: 4,
  },
  questDesc: { color: "#333", fontSize: 14 },
});
