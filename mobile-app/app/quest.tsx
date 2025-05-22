import MapView, { Marker, Callout } from "react-native-maps";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

const DEV_MODE = true; // Sätt till false för produktion

type Clue = {
  clueId: number;
  clueDescription: string;
  puzzleName: string;
  puzzleDescription: string;
  puzzleAnswer: string;
  locationName: string;
  locationDescription?: string;
  latitude: number;
  longitude: number;
};

type Quest = {
  questId: number;
  questName: string;
  questLongDescription: string;
  latitude: number;
  longitude: number;
};

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // meter
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
      // canSolve sätts bara till true när användaren tryckt "Jag hittade platsen!" i DEV_MODE
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

    // Vibrera EN gång när man blir nära
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
      // Nästa ledtråd visas automatiskt via useEffect nedan
    } else {
      setError("Fel svar, försök igen!");
    }
  };

  // När ett pussel är löst, visa nästa ledtråd automatiskt
  useEffect(() => {
    if (solved[current] && current < clues.length - 1) {
      setTimeout(() => {
        setCurrent((i) => i + 1);
        setModalVisible(true); // Visa ledtråds-modal för nästa steg
        setCanSolve(false); // Markör/pussel visas först när användaren trycker "Jag hittade platsen"
      }, 1000);
    }
  }, [solved, current, clues.length]);

  // När sista pusslet är löst, visa grattis-modal
  const allSolved = solved.length > 0 && solved.every(Boolean);

  if (loading || !quest) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FFD700" size="large" />
      </View>
    );
  }

  if (!loading && (!quest || clues.length === 0)) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>
          Kunde inte ladda quest eller ledtrådar.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Karta som bakgrund */}
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: quest.latitude,
          longitude: quest.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {/* Visa markör ENDAST om användaren är nära platsen eller i DEV_MODE */}
        {canSolve && clues[current] && (
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
      <Modal
        visible={modalVisible && !canSolve && !allSolved}
        transparent
        animationType="slide"
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            {/* Anta att quest har questLongDescription */}
            {current === 0 && quest?.questLongDescription && (
              <Text
                style={[
                  styles.clueDesc,
                  { marginBottom: 18, color: "#444", fontStyle: "italic" },
                ]}
              >
                {quest.questLongDescription}
              </Text>
            )}
            <Text style={styles.clueTitle}>
              Ledtråd {current + 1} av {clues.length}
            </Text>
            <Text style={styles.clueDesc}>
              {clues[current]?.clueDescription}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(false);
                if (DEV_MODE) setCanSolve(true); // I utvecklingsläge: visa markör direkt
              }}
            >
              <Text style={styles.buttonText}>Jag hittade platsen</Text>
            </TouchableOpacity>
            {DEV_MODE && (
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#ca8a04", marginTop: 8 },
                ]}
                onPress={() => {
                  // Låtsas att pusslet är löst och gå till nästa ledtråd
                  setSolved((prev) => {
                    const copy = [...prev];
                    copy[current] = true;
                    return copy;
                  });
                  setModalVisible(false);
                  setCanSolve(false);
                  setAnswer("");
                  setError("");
                }}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Hoppa till nästa
                </Text>
              </TouchableOpacity>
            )}
            {!DEV_MODE && (
              <Text style={{ color: "#888", marginTop: 12, fontSize: 13 }}>
                Markören visas när du är nära platsen.
              </Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Pussel-modal */}
      <Modal
        visible={modalVisible && canSolve && !allSolved}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Kryss-knapp */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 28, color: "#888" }}>×</Text>
            </TouchableOpacity>
            {/* Platsens namn och beskrivning */}
            <Text style={styles.puzzleName}>
              {clues[current]?.locationName}
            </Text>
            {clues[current]?.locationDescription && (
              <Text style={styles.puzzleDesc}>
                {clues[current].locationDescription}
              </Text>
            )}
            {/* Pussel */}
            <Text style={styles.puzzleName}>{clues[current]?.puzzleName}</Text>
            <Text style={styles.puzzleDesc}>
              {clues[current]?.puzzleDescription}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ditt svar..."
              value={answer}
              onChangeText={setAnswer}
              autoFocus
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.solveButton} onPress={handleSolve}>
              <Text style={styles.solveButtonText}>Lös pussel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Grattis-modal */}
      <Modal visible={allSolved} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Grattis!</Text>
            <Text style={styles.clueDesc}>Du har klarat alla utmaningar!</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(true); // Visa första ledtråds-modal igen
                setCurrent(0); // Börja om på första ledtråden
                setSolved(Array(clues.length).fill(false)); // Nollställ lösta pussel
                setAnswer(""); // Töm svarsfältet
                setError(""); // Töm felmeddelande
              }}
            >
              <Text style={styles.buttonText}>Avsluta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#121212",
    minHeight: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    color: "#FFD700",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  clueTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFD700",
    marginBottom: 8,
    marginTop: 8,
  },
  clueDesc: {
    fontSize: 16,
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  puzzleName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ca8a04",
    marginBottom: 4,
    marginTop: 8,
  },
  puzzleDesc: {
    fontSize: 15,
    color: "#444",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  buttonText: { color: "#222", fontWeight: "bold", fontSize: 18 },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    width: "85%",
    alignItems: "center",
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  error: { color: "red", marginBottom: 8, fontSize: 14 },
  solveButton: {
    backgroundColor: "#ca8a04",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  solveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
  },
});
