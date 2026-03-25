import React from "react";
import { View, Text } from "react-native";
import { themeStyles } from "../../styles/theme";

export default function ScoreboardScreen() {
  // Här kan jag visa topplista eller poäng
  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>Scoreboard</Text>
      {/* Visa scoreboard-data här */}
    </View>
  );
}
