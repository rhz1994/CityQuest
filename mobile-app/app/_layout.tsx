import { Slot } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import { Language } from "../i18n/translations";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { themeStyles } from "../styles/theme";
import { colors, spacing } from "../styles/tokens";

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: "sv", label: "Svenska" },
  { code: "en", label: "English" },
  { code: "da", label: "Dansk" },
  { code: "no", label: "Norsk" },
  { code: "de", label: "Deutsch" },
];

function LanguageStartupPicker() {
  const { language, setLanguage, hasSelectedLanguage, t } = useLanguage();

  return (
    <Modal visible={!hasSelectedLanguage} transparent animationType="fade">
      <View style={themeStyles.modalBg}>
        <View style={themeStyles.modalContent}>
          <Text style={themeStyles.title}>{t("languagePicker.title")}</Text>
          <Text style={[themeStyles.clueDesc, { marginBottom: spacing.md }]}>
            {t("languagePicker.body")}
          </Text>
          <View style={{ width: "100%", gap: spacing.xs }}>
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = option.code === language;
              return (
                <TouchableOpacity
                  key={option.code}
                  style={[
                    themeStyles.solveButton,
                    {
                      width: "100%",
                      borderWidth: 1,
                      borderColor: colors.accentGold,
                      opacity: selected ? 1 : 0.82,
                    },
                  ]}
                  onPress={() => setLanguage(option.code)}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                >
                  <Text style={themeStyles.solveButtonText}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LocationProvider>
          <Slot />
          <LanguageStartupPicker />
        </LocationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
