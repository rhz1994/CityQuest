import React from "react";
import { themeStyles } from "../styles/theme";
import {
  Modal,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Eller annan ikonkälla

type PuzzleModalProps = {
  visible: boolean;
  clue: any;
  answer: string;
  error?: string;
  onAnswerChange: (text: string) => void;
  onSolve: () => void;
  onClose: () => void;
};

export default function PuzzleModal({
  visible,
  clue,
  answer,
  error,
  onAnswerChange,
  onSolve,
  onClose,
}: PuzzleModalProps) {
  if (!clue) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={themeStyles.modalBg}>
        <View style={themeStyles.modalContent}>
          {/* ❌ Stäng-knapp (kryss) */}
          <TouchableOpacity onPress={onClose} style={themeStyles.closeButton}>
            <Ionicons name="close" size={24} color="#bfa76a" />
          </TouchableOpacity>

          <Text style={themeStyles.puzzleName}>{clue.locationName}</Text>

          {clue.locationDescription && (
            <Text style={themeStyles.puzzleDesc}>
              {clue.locationDescription}
            </Text>
          )}

          {clue.locationImage && (
            <Image
              source={{ uri: clue.locationImage }}
              style={{
                width: 220,
                height: 120,
                borderRadius: 12,
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
          )}

          <Text style={themeStyles.puzzleName}>{clue.puzzleName}</Text>
          <Text style={themeStyles.puzzleDesc}>{clue.puzzleDescription}</Text>

          <TextInput
            style={themeStyles.input}
            placeholder="Ditt svar..."
            value={answer}
            onChangeText={onAnswerChange}
            autoFocus
          />

          {error ? <Text style={themeStyles.error}>{error}</Text> : null}

          <TouchableOpacity style={themeStyles.solveButton} onPress={onSolve}>
            <Text style={themeStyles.solveButtonText}>Lös pussel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
