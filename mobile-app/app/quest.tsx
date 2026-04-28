import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import API_URL from "../config/api";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import PuzzleModal from "../components/PuzzleModal";
import ClueModal from "../components/ClueModal";
import { useLanguage } from "../context/LanguageContext";
import {
  StatusChip,
  FloatingActionButton,
} from "../components/ui/AppPrimitives";
import { themeStyles } from "../styles/theme";
import { colors, radius, spacing } from "../styles/tokens";
import { getDistanceMeters } from "../utilities/utils";
import { antiqueMapStyle } from "../styles/mapStyle";

const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === "true";

type Quest = {
  questId: number;
  cityId: number;
  questName: string;
  questShortDescription: string | null;
  questIntroImage: string | null;
  cityName: string;
  latitude: number;
  longitude: number;
};

type Clue = {
  clueId: number;
  questId: number;
  locationId: number;
  clueDescription: string | null;
  clueOrder: number;
  locationName: string;
  locationDescription: string | null;
  locationImage: string | null;
  latitude: number;
  longitude: number;
  puzzleId: number | null;
  puzzleName: string | null;
  puzzleDescription: string | null;
  puzzleAnswer: string | null;
};

export default function QuestScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const questId = Array.isArray(params.questId)
    ? params.questId[0]
    : params.questId;
  const [quest, setQuest] = useState<Quest | null>(null);
  const [clues, setClues] = useState<Clue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal state
  const [current, setCurrent] = useState(0);
  const [solved, setSolved] = useState<boolean[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [canSolve, setCanSolve] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);
  const [showClue, setShowClue] = useState(true);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [distanceToClue, setDistanceToClue] = useState<number | null>(null);

  const fetchQuestData = () => {
    setLoading(true);
    setFetchError(null);
    Promise.all([
      fetch(`${API_URL}/quests/${questId}`).then((res) => res.json()),
      fetch(`${API_URL}/clues/quest/${questId}`).then((res) => res.json()),
    ])
      .then(([questData, cluesData]) => {
        setQuest(questData);
        setClues(cluesData);
        setSolved(Array(cluesData.length).fill(false));
      })
      .catch(() => {
        setFetchError(t("quest.fetchError"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestData();
  }, [questId]);

  // Hämta användarens position kontinuerligt
  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("quest.locationRequiredTitle"),
          t("quest.locationRequiredBody"),
        );
        return;
      }
      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        },
      );
    })();
    return () => {
      if (watcher) watcher.remove();
    };
  }, []);

  // Kolla om användaren är nära platsen för aktuell ledtråd
  useEffect(() => {
    if (!userLocation || !clues[current]) {
      setCanSolve(false);
      setHasVibrated(false);
      return;
    }
    if (DEV_MODE) {
      // canSolve sätts bara till true när användaren tryckt "Search for the location!" i DEV_MODE
      return;
    }
    const dist = getDistanceMeters(
      userLocation.latitude,
      userLocation.longitude,
      clues[current].latitude,
      clues[current].longitude,
    );
    setDistanceToClue(dist);
    const isNear = dist < 30;
    setCanSolve(isNear);

    // Vibrera EN gång när man är nära
    if (isNear && !hasVibrated) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setHasVibrated(true);
    }
    if (!isNear && hasVibrated) {
      setHasVibrated(false); // Återställ om man går bort från platsen
    }
  }, [userLocation, clues, current, hasVibrated]);

  // Visa pussel-modal automatiskt i produktion när man är nära platsen
  useEffect(() => {
    if (!DEV_MODE && canSolve) {
      setShowPuzzle(true);
      setShowClue(false);
    }
  }, [canSolve]);

  const handleSolve = () => {
    if (
      answer.trim().toLowerCase() ===
      (clues[current].puzzleAnswer || "").trim().toLowerCase()
    ) {
      setSolved((prev) => {
        const copy = [...prev];
        copy[current] = true;
        return copy;
      });
      setError("");
      setAnswer("");
      setShowPuzzle(false);
    } else {
      setError(t("quest.wrongAnswer"));
    }
  };

  // När ett pussel är löst, visa nästa ledtråd automatiskt
  useEffect(() => {
    if (solved[current] && current < clues.length - 1) {
      setTimeout(() => {
        setCurrent((i) => i + 1);
        setShowClue(true);
        setShowPuzzle(false);
        setCanSolve(false);
        setAnswer("");
        setError("");
      }, 1000);
    }
  }, [solved, current, clues.length]);

  // När sista pusslet är löst, visa grattis-modal
  const allSolved = solved.length > 0 && solved.every(Boolean);

  if (loading) {
    return (
      <View style={themeStyles.centered}>
        <ActivityIndicator color={colors.accentGoldSoft} size="large" />
      </View>
    );
  }

  if (fetchError || !quest || clues.length === 0) {
    return (
      <View style={themeStyles.centered}>
        <Text style={styles.errorText}>
          {fetchError ?? t("quest.emptyClues")}
        </Text>
        <TouchableOpacity
          style={themeStyles.solveButton}
          onPress={fetchQuestData}
          accessibilityRole="button"
          accessibilityLabel={t("quest.retryLoadA11y")}
        >
          <Text style={themeStyles.solveButtonText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Karta */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={antiqueMapStyle}
        initialRegion={{
          latitude: quest.latitude,
          longitude: quest.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {/* Markör för aktuell ledtråd */}
        {clues[current] && (
          <Marker
            coordinate={{
              latitude: Number(clues[current].latitude),
              longitude: Number(clues[current].longitude),
            }}
            title={clues[current].locationName}
            description={clues[current].clueDescription ?? undefined}
            onPress={() => {
              if (DEV_MODE) {
                setShowPuzzle(true);
                setShowClue(false);
              }
            }}
          >
            <Callout
              tooltip
              onPress={() => {
                if (DEV_MODE) {
                  setShowPuzzle(true);
                  setShowClue(false);
                }
              }}
            >
              <View
                style={styles.calloutBubble}
              >
                <Text style={styles.calloutText}>
                  {t("quest.callout")}
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
      <View pointerEvents="none" style={styles.mapOverlay} />
      {!allSolved && distanceToClue !== null && (
        <StatusChip
          text={t("quest.distanceToClue", { meters: Math.round(distanceToClue) })}
          style={styles.distanceChip}
        />
      )}

      {/* Ledtråds-modal */}
      <ClueModal
        visible={showClue && !showPuzzle && !allSolved}
        quest={quest}
        clue={clues[current]}
        current={current}
        total={clues.length}
        DEV_MODE={DEV_MODE}
        onSearch={() => {
          setShowClue(false);
          if (DEV_MODE) setShowPuzzle(false);
        }}
        onClose={() => setShowClue(false)}
        onSkip={
          DEV_MODE
            ? () => {
                setSolved((prev) => {
                  const copy = [...prev];
                  copy[current] = true;
                  return copy;
                });
                setShowClue(false);
                setShowPuzzle(false);
                setAnswer("");
                setError("");
              }
            : undefined
        }
      />

      {/* Pussel-modal */}
      <PuzzleModal
        visible={showPuzzle && !allSolved}
        clue={clues[current]}
        answer={answer}
        error={error}
        onAnswerChange={setAnswer}
        onSolve={handleSolve}
        onClose={() => setShowPuzzle(false)}
      />

      {/* Grattis-modal */}
      <Modal visible={allSolved} transparent animationType="slide">
        <View style={themeStyles.modalBg}>
          <View style={themeStyles.modalContent}>
            <Text style={themeStyles.title}>{t("quest.congratsTitle")}</Text>
            <Text style={themeStyles.clueDesc}>
              {t("quest.congratsBody")}
            </Text>
            <TouchableOpacity
              style={themeStyles.button}
              onPress={() => {
                setCurrent(0);
                setSolved(Array(clues.length).fill(false));
                setAnswer("");
                setError("");
                setShowClue(true);
                setShowPuzzle(false);
              }}
            >
              <Text style={themeStyles.buttonText}>{t("quest.finish")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Visa ledtråd knapp */}
      {!showClue && !showPuzzle && !allSolved && (
        <FloatingActionButton
          label={t("quest.showClue")}
          onPress={() => setShowClue(true)}
          accessibilityLabel={t("quest.showClue")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  calloutBubble: {
    backgroundColor: colors.accentGoldSoft,
    paddingVertical: spacing.xs,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.accentBorder,
    alignItems: "center",
  },
  calloutText: {
    color: colors.textDark,
    fontWeight: "bold",
    fontSize: 16,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16,21,27,0.22)",
  },
  distanceChip: {
    position: "absolute",
    top: 52,
  },
});
