import React from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import { themeStyles } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ClueModal({ ...props }) {
  if (!props.clue) return null;

  return (
    <Modal visible={props.visible} transparent animationType="slide">
      <View style={themeStyles.modalBg}>
        <View style={themeStyles.modalContent}>
          {/* Kryss för att stänga */}
          <TouchableOpacity
            onPress={props.onClose}
            style={themeStyles.closeButton}
          >
            <Ionicons name="close" size={24} color="#bfa76a" />
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
            Ledtråd {props.current + 1} av {props.total}
          </Text>

          <Text style={themeStyles.clueDesc}>{props.clue.clueDescription}</Text>

          <TouchableOpacity style={themeStyles.button} onPress={props.onSearch}>
            <Text style={themeStyles.buttonText}>Search for the location</Text>
          </TouchableOpacity>

          {!props.DEV_MODE && (
            <Text
              style={[
                themeStyles.clueDesc,
                {
                  color: "#888",
                  marginTop: 12,
                  fontSize: 13,
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  padding: 0,
                },
              ]}
            >
              Markören visas när du är nära platsen.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
