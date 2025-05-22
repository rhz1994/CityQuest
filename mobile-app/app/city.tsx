import React, { useEffect, useState } from "react";
import { themeStyles } from "../styles/theme";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Quest = {
  questId: number;
  questName: string;
  questShortDescription: string;
  questIntroImage: string; // Lägg till denna rad!
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

  const renderQuestCard = ({ item }: { item: Quest }) => (
    <TouchableOpacity
      style={themeStyles.questButton}
      onPress={() =>
        router.push({ pathname: "/quest", params: { questId: item.questId } })
      }
    >
      {item.questIntroImage && (
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: item.questIntroImage }}
            style={{
              width: 320,
              height: 140,
              borderRadius: 10,
              marginBottom: 8,
            }}
            resizeMode="cover"
          />
        </View>
      )}
      <Text style={themeStyles.questDesc}>{item.questShortDescription}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>Quests in {city}</Text>
      {loading ? (
        <ActivityIndicator color="#FFD700" size="large" />
      ) : (
        <FlatList
          data={quests}
          renderItem={renderQuestCard}
          keyExtractor={(item) => item.questId.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </View>
  );
}
