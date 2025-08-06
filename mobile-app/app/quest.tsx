import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
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
import { themeStyles } from "../styles/theme";
import { getDistanceMeters } from "../utilities/utils";
import { antiqueMapStyle } from "../styles/mapStyle";

const DEV_MODE = true;

type Quest = {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  // Lägg till andra fält som behövs
};

type Clue = {
  id: number;
  questId: number;
  locationName: string;
  clueDescription: string;
  latitude: number;
  longitude: number;
  puzzleAnswer?: string;
  // Lägg till andra fält som behövs
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#18191a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#18191a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#bfa76a" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#232323" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#10151b" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#23221f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#23221f" }],
  },
  // Lägg till fler regler om du vill
];

export default function QuestScreen() {
  const params = useLocalSearchParams();
  const questId = Array.isArray(params.questId)
    ? params.questId[0]
    : params.questId;
  const [quest, setQuest] = useState<Quest | null>(null);
  const [clues, setClues] = useState<Clue[]>([]);
  const [loading, setLoading] = useState(true);

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
      setError("Fel svar, försök igen!");
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
            description={clues[current].clueDescription}
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
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(16,21,27,0.22)",
        }}
      />

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
                setShowClue(true);
                setShowPuzzle(false);
              }}
            >
              <Text style={themeStyles.buttonText}>Avsluta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Visa ledtråd knapp */}
      {!showClue && !showPuzzle && !allSolved && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: "#bfa76a",
            borderRadius: 30,
            padding: 14,
            elevation: 4,
          }}
          onPress={() => setShowClue(true)}
        >
          <Text style={{ color: "#232323", fontWeight: "bold" }}>
            Visa ledtråd
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
