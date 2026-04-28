import React from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import { themeStyles } from "../styles/theme";
import { colors } from "../styles/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";

export default function ClueModal({ ...props }) {
  const { t } = useLanguage();
  if (!props.clue) return null;

  return (
    <Modal visible={props.visible} transparent animationType="slide">
      <View style={themeStyles.modalBg}>
        <View style={themeStyles.modalContent}>
          {/* Kryss för att stänga */}
          <TouchableOpacity
            onPress={props.onClose}
            style={themeStyles.closeButton}
            accessibilityRole="button"
            accessibilityLabel={t("clue.closeA11y")}
          >
            <Ionicons name="close" size={24} color={colors.accentGold} />
          </TouchableOpacity>

          {props.current === 0 && (
            <>
              {props.quest?.questIntroImage && (
                <Image
                  source={{ uri: props.quest.questIntroImage }}
                  style={{
                    width: 220,
                    height: 120,
                    borderRadius: 12,
                    marginBottom: 16,
                  }}
                  resizeMode="cover"
                />
              )}
              {props.quest?.questLongDescription && (
                <Text style={[themeStyles.clueDesc, { marginBottom: 18 }]}>
                  {props.quest.questLongDescription}
                </Text>
              )}
            </>
          )}

          <Text style={themeStyles.clueTitle}>
            {t("clue.progress", { current: props.current + 1, total: props.total })}
          </Text>

          <Text style={themeStyles.clueDesc}>{props.clue.clueDescription}</Text>

          <TouchableOpacity
            style={themeStyles.button}
            onPress={props.onSearch}
            accessibilityRole="button"
            accessibilityLabel={t("clue.searchLocationA11y")}
          >
            <Text style={themeStyles.buttonText}>{t("clue.searchLocation")}</Text>
          </TouchableOpacity>

          {!props.DEV_MODE && (
            <Text
              style={[
                themeStyles.clueDesc,
                {
                  color: colors.textMuted,
                  marginTop: 12,
                  fontSize: 13,
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                },
              ]}
            >
              {t("clue.markerHint")}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
