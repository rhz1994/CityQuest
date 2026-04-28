import React from "react";
import { themeStyles } from "../styles/theme";
import { colors, radius } from "../styles/tokens";
import {
  Modal,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Eller annan ikonkälla
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();
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
          <TouchableOpacity
            onPress={onClose}
            style={themeStyles.closeButton}
            accessibilityRole="button"
            accessibilityLabel={t("puzzle.closeA11y")}
          >
            <Ionicons name="close" size={24} color={colors.accentGold} />
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
                borderRadius: radius.md,
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
          )}

          <Text style={themeStyles.puzzleName}>{clue.puzzleName}</Text>
          <Text style={themeStyles.puzzleDesc}>{clue.puzzleDescription}</Text>

          <TextInput
            style={themeStyles.input}
            placeholder={t("puzzle.answerPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={answer}
            onChangeText={onAnswerChange}
            autoFocus
            accessibilityLabel={t("puzzle.answerA11y")}
          />

          {error ? <Text style={themeStyles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={themeStyles.solveButton}
            onPress={onSolve}
            accessibilityRole="button"
            accessibilityLabel={t("puzzle.solveA11y")}
          >
            <Text style={themeStyles.solveButtonText}>{t("puzzle.solve")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
