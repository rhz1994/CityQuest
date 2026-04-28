import React, { useEffect, useState } from "react";
import { themeStyles } from "../styles/theme";
import API_URL from "../config/api";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLanguage } from "../context/LanguageContext";

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // hämtar stad

  const fetchQuests = () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/quests/city/${city}`)
      .then((res) => res.json())
      .then((data) => {
        setQuests(data);
      })
      .catch(() => setError(t("city.fetchError")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuests();
  }, [city]);

  const renderQuestCard = ({ item }: { item: Quest }) => (
    <TouchableOpacity
      style={themeStyles.questButton}
      accessibilityRole="button"
      accessibilityLabel={t("city.openQuestA11y", { quest: item.questName })}
      onPress={() =>
        router.push({ pathname: "/quest", params: { questId: item.questId } })
      }
    >
      {item.questIntroImage && (
        <View style={{ alignContent: "center" }}>
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
      <Text style={themeStyles.title}>{t("city.title", { city: city ?? "" })}</Text>
      {loading ? (
        <ActivityIndicator color="#FFD700" size="large" />
      ) : error ? (
        <View style={{ alignItems: "center" }}>
          <Text style={themeStyles.error}>{error}</Text>
          <TouchableOpacity
            style={themeStyles.solveButton}
            onPress={fetchQuests}
            accessibilityRole="button"
            accessibilityLabel={t("city.retryFetchA11y")}
          >
            <Text style={themeStyles.solveButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={quests}
          renderItem={renderQuestCard}
          keyExtractor={(item) => item.questId.toString()}
          ListEmptyComponent={
            <Text style={themeStyles.clueDesc}>
              {t("city.emptyQuests")}
            </Text>
          }
          contentContainerStyle={{ paddingVertical: 16 }}
          initialNumToRender={5}
          windowSize={5}
        />
      )}
    </View>
  );
}
