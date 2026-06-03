import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { themeStyles } from "../../styles/theme";
import { colors } from "../../styles/tokens";
import { SectionCard } from "../../components/ui/AppPrimitives";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config/api";
import { authFetch } from "../../services/authService";
import type { Language } from "../../i18n/translations";

const LANGUAGE_OPTIONS: {
  code: Language;
  labelKey:
    | "account.languageSwedish"
    | "account.languageEnglish"
    | "account.languageDanish"
    | "account.languageNorwegian"
    | "account.languageGerman";
}[] = [
  { code: "sv", labelKey: "account.languageSwedish" },
  { code: "en", labelKey: "account.languageEnglish" },
  { code: "da", labelKey: "account.languageDanish" },
  { code: "no", labelKey: "account.languageNorwegian" },
  { code: "de", labelKey: "account.languageGerman" },
];

export default function AccountScreen() {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      setIsLoadingProgress(true);
      setProgressError(null);
      try {
        const response = await authFetch(`${API_URL}/rewards/user/${user.userId}`);
        const rewards = (await response.json()) as { questId: number }[];
        if (!response.ok) {
          throw new Error("Could not load progress");
        }
        setCompletedQuestIds(
          Array.from(new Set(rewards.map((item) => Number(item.questId)))),
        );
      } catch {
        setProgressError(t("account.progressError"));
      } finally {
        setIsLoadingProgress(false);
      }
    };

    void loadProgress();
  }, [t, user]);

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
      {isLoadingProgress ? (
        <ActivityIndicator color={colors.accentGold} />
      ) : progressError ? (
        <Text style={themeStyles.error}>{progressError}</Text>
      ) : (
        <FlatList
          data={completedQuestIds}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <Text style={themeStyles.questDesc}>Quest #{item}</Text>
          )}
          ListEmptyComponent={
            <Text style={themeStyles.clueDesc}>
              {t("account.emptyCompleted")}
            </Text>
          }
        />
      )}
      <Text style={[themeStyles.clueTitle, { marginTop: 24 }]}>
        {t("account.savedQuests")}
      </Text>
      <FlatList
        data={[] as number[]}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <Text style={themeStyles.questDesc}>{item}</Text>}
        ListEmptyComponent={
          <Text style={themeStyles.clueDesc}>{t("account.emptySaved")}</Text>
        }
      />
    </View>
  );
}
