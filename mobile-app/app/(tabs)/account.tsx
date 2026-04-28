import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { themeStyles } from "../../styles/theme";
import { colors } from "../../styles/tokens";
import { SectionCard } from "../../components/ui/AppPrimitives";
import { useLanguage } from "../../context/LanguageContext";

export default function AccountScreen() {
  const { t, language, setLanguage } = useLanguage();
  // dummy-data
  const [completedQuests] = useState([
    { id: 1, title: "Mysteriet i Gamla Stan" },
    { id: 2, title: "Skattjakten i Slottet" },
  ]);
  const [savedQuests] = useState([{ id: 3, title: "Hemliga biblioteket" }]);

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>{t("account.title")}</Text>
      <SectionCard title={t("account.language")}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={[
              themeStyles.solveButton,
              {
                borderColor: colors.accentGold,
                borderWidth: 1,
                opacity: language === "sv" ? 1 : 0.75,
              },
            ]}
            onPress={() => setLanguage("sv")}
          >
            <Text style={themeStyles.solveButtonText}>{t("account.languageSwedish")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              themeStyles.solveButton,
              {
                borderColor: colors.accentGold,
                borderWidth: 1,
                opacity: language === "en" ? 1 : 0.75,
              },
            ]}
            onPress={() => setLanguage("en")}
          >
            <Text style={themeStyles.solveButtonText}>{t("account.languageEnglish")}</Text>
          </TouchableOpacity>
        </View>
      </SectionCard>
      <Text style={themeStyles.clueTitle}>{t("account.completedQuests")}</Text>
      <FlatList
        data={completedQuests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={themeStyles.questDesc}> • {item.title} </Text>
        )}
        ListEmptyComponent={
          <Text style={themeStyles.clueDesc}>
            {t("account.emptyCompleted")}
          </Text>
        }
      />
      <Text style={[themeStyles.clueTitle, { marginTop: 24 }]}>
        {t("account.savedQuests")}
      </Text>
      <FlatList
        data={savedQuests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={themeStyles.questDesc}> • {item.title} </Text>
        )}
        ListEmptyComponent={
          <Text style={themeStyles.clueDesc}>{t("account.emptySaved")}</Text>
        }
      />
    </View>
  );
}
