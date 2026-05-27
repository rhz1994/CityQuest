import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { themeStyles } from "../../styles/theme";
import { colors } from "../../styles/tokens";
import { SectionCard } from "../../components/ui/AppPrimitives";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import type { Language } from "../../i18n/translations";

const LANGUAGE_OPTIONS: Array<{
  code: Language;
  labelKey:
    | "account.languageSwedish"
    | "account.languageEnglish"
    | "account.languageDanish"
    | "account.languageNorwegian"
    | "account.languageGerman";
}> = [
  { code: "sv", labelKey: "account.languageSwedish" },
  { code: "en", labelKey: "account.languageEnglish" },
  { code: "da", labelKey: "account.languageDanish" },
  { code: "no", labelKey: "account.languageNorwegian" },
  { code: "de", labelKey: "account.languageGerman" },
];

export default function AccountScreen() {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  // dummy-data
  const [completedQuests] = useState([
    { id: 1, title: "Mysteriet i Gamla Stan" },
    { id: 2, title: "Skattjakten i Slottet" },
  ]);
  const [savedQuests] = useState([{ id: 3, title: "Hemliga biblioteket" }]);

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>{t("account.title")}</Text>
      {user ? (
        <SectionCard title={t("account.signedInAs")}>
          <Text style={themeStyles.questDesc}>{user.userName}</Text>
          <Text style={themeStyles.clueDesc}>{user.userEmail}</Text>
          <TouchableOpacity
            style={[themeStyles.solveButton, { marginTop: 12 }]}
            onPress={() => void signOut()}
          >
            <Text style={themeStyles.solveButtonText}>{t("account.signOut")}</Text>
          </TouchableOpacity>
        </SectionCard>
      ) : null}
      <SectionCard title={t("account.language")}>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {LANGUAGE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.code}
              style={[
                themeStyles.solveButton,
                {
                  borderColor: colors.accentGold,
                  borderWidth: 1,
                  opacity: language === option.code ? 1 : 0.75,
                },
              ]}
              onPress={() => setLanguage(option.code)}
            >
              <Text style={themeStyles.solveButtonText}>{t(option.labelKey)}</Text>
            </TouchableOpacity>
          ))}
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
