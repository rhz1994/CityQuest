import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

type Clue = {
  clueId: number;
  clueDescription: string;
  puzzleName: string;
  puzzleDescription: string;
  puzzleAnswer: string;
};

type Quest = {
  questId: number;
  questName: string;
  questDescription: string;
};

export default function QuestScreen() {
  const params = useLocalSearchParams();
  const questId = Array.isArray(params.questId)
    ? params.questId[0]
    : params.questId;
  const [quest, setQuest] = useState<Quest | null>(null);
  const [clues, setClues] = useState<Clue[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [solved, setSolved] = useState<boolean[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

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
    } else {
      setError("Fel svar, försök igen!");
    }
  };

  const next = () => {
    if (current < clues.length - 1) {
      setCurrent((i) => i + 1);
      setAnswer("");
      setError("");
    } else {
      resetModal();
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((i) => i - 1);
      setAnswer("");
      setError("");
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setCurrent(0);
    setAnswer("");
    setError("");
    setSolved(Array(clues.length).fill(false));
  };

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{quest.questName}</Text>
      <Text style={styles.desc}>{quest.questDescription}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Starta spel</Text>
      </TouchableOpacity>

      {/* Modal för ledtråd + pussel */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={resetModal}>
              <Text style={{ fontSize: 28, color: "#888" }}>×</Text>
            </TouchableOpacity>
            <Text style={styles.clueTitle}>
              Ledtråd {current + 1} av {clues.length}
            </Text>
            <Text style={styles.clueDesc}>
              {clues[current].clueDescription}
            </Text>
            <Text style={styles.puzzleName}>{clues[current].puzzleName}</Text>
            <Text style={styles.puzzleDesc}>
              {clues[current].puzzleDescription}
            </Text>
            {!solved[current] ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Ditt svar..."
                  value={answer}
                  onChangeText={setAnswer}
                  autoFocus
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity
                  style={styles.solveButton}
                  onPress={handleSolve}
                >
                  <Text style={styles.solveButtonText}>Lös pussel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.solvedText}>Du har löst denna ledtråd!</Text>
            )}
            <View style={styles.modalNav}>
              <TouchableOpacity
                onPress={prev}
                disabled={current === 0}
                style={[styles.navButton, current === 0 && { opacity: 0.5 }]}
              >
                <Text style={styles.navButtonText}>Föregående</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={next}
                disabled={!solved[current]}
                style={[styles.navButton, !solved[current] && { opacity: 0.5 }]}
              >
                <Text style={styles.navButtonText}>
                  {current === clues.length - 1 ? "Stäng" : "Nästa"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  desc: { color: "#fff", fontSize: 16, marginBottom: 24, textAlign: "center" },
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
  closeButton: { position: "absolute", top: 10, right: 16, zIndex: 10 },
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
  solvedText: {
    color: "#16a34a",
    fontWeight: "bold",
    marginVertical: 12,
    fontSize: 16,
  },
  modalNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
  navButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  navButtonText: { color: "#222", fontWeight: "bold", fontSize: 16 },
});
