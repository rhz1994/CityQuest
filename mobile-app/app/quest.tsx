import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import PuzzleModal from "../components/PuzzleModal";
import ClueModal from "../components/ClueModal";
import { themeStyles } from "../styles/theme";

const DEV_MODE = true;

export default function QuestScreen() {
  const params = useLocalSearchParams();
  const questId = Array.isArray(params.questId)
    ? params.questId[0]
    : params.questId;
  const [quest, setQuest] = useState<Quest | null>(null);
  const [clues, setClues] = useState<Clue[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalVisible, setModalVisible] = useState(true);
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

  useEffect(() => {
    fetch(`http://192.168.1.110:5000/quests/${questId}`)
      .then((res) => res.json())
      .then((data) => setQuest(data));

    fetch(`http://192.168.1.110:5000/clues/quest/${questId}`)
      .then((res) => res.json())
      .then((data) => {
        setClues(data);
        setSolved(Array(data.length).fill(false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [questId]);

  // Hämta användarens position kontinuerligt
  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Platstjänster krävs",
          "Ge appen tillgång till plats för att spela."
        );
        return;
      }
      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
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
      clues[current].longitude
    );
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
      setModalVisible(false);
    } else {
      setError("Fel svar, försök igen!");
    }
  };

  // När ett pussel är löst, visa nästa ledtråd automatiskt
  useEffect(() => {
    if (solved[current] && current < clues.length - 1) {
      setTimeout(() => {
        setCurrent((i) => i + 1);
        setModalVisible(true);
        setCanSolve(false);
      }, 1000);
    }
  }, [solved, current, clues.length]);

  // När sista pusslet är löst, visa grattis-modal
  const allSolved = solved.length > 0 && solved.every(Boolean);

  if (loading || !quest) {
    return (
      <View style={themeStyles.centered}>
        <ActivityIndicator color="#FFD700" size="large" />
      </View>
    );
  }

  if (!loading && (!quest || clues.length === 0)) {
    return (
      <View style={themeStyles.centered}>
        <Text style={{ color: "#fff" }}>
          Kunde inte ladda quest eller ledtrådar.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Karta */}
      <MapView
        style={{ flex: 1 }}
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
            description={clues[current].clueDescription}
            onPress={() => setModalVisible(true)}
          >
            <Callout tooltip onPress={() => setModalVisible(true)}>
              <View
                style={{
                  backgroundColor: "#FFD700",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#ca8a04",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#222", fontWeight: "bold", fontSize: 16 }}
                >
                  Tryck här för pussel!
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>

      {/* Ledtråds-modal */}
      <ClueModal
        visible={modalVisible && !canSolve && !allSolved}
        quest={quest}
        clue={clues[current]}
        current={current}
        total={clues.length}
        DEV_MODE={DEV_MODE}
        onSearch={() => {
          setModalVisible(false);
          if (DEV_MODE) setCanSolve(true);
        }}
        onSkip={
          DEV_MODE
            ? () => {
                setSolved((prev) => {
                  const copy = [...prev];
                  copy[current] = true;
                  return copy;
                });
                setModalVisible(false);
                setCanSolve(false);
                setAnswer("");
                setError("");
              }
            : undefined
        }
      />

      {/* Pussel-modal */}
      <PuzzleModal
        visible={modalVisible && canSolve && !allSolved}
        clue={clues[current]}
        answer={answer}
        error={error}
        onAnswerChange={setAnswer}
        onSolve={handleSolve}
        onClose={() => setModalVisible(false)}
      />

      {/* Grattis-modal */}
      <Modal visible={allSolved} transparent animationType="slide">
        <View style={themeStyles.modalBg}>
          <View style={themeStyles.modalContent}>
            <Text style={themeStyles.title}>Grattis!</Text>
            <Text style={themeStyles.clueDesc}>
              Du har klarat alla ledtrådar och pussel.
            </Text>
            <TouchableOpacity
              style={themeStyles.button}
              onPress={() => {
                setCurrent(0);
                setSolved(Array(clues.length).fill(false));
                setAnswer("");
                setError("");
              }}
            >
              <Text style={themeStyles.buttonText}>Avsluta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Hjälpfunktion för avståndsberäkning (lägg gärna i en utils-fil)
function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
