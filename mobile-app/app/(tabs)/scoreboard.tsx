import React from "react";
import { View, Text } from "react-native";
import { themeStyles } from "../../styles/theme";
import { SectionCard } from "../../components/ui/AppPrimitives";
import { useLanguage } from "../../context/LanguageContext";

export default function ScoreboardScreen() {
  const { t } = useLanguage();
  // Här kan jag visa topplista eller poäng
  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>{t("scoreboard.title")}</Text>
      <SectionCard>
        <Text style={[themeStyles.clueDesc, { marginBottom: 0 }]}>
          {t("scoreboard.body")}
        </Text>
      </SectionCard>
    </View>
  );
}
