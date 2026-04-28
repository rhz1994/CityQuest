import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { antiqueMapStyle } from "../../styles/mapStyle";
import { useLocation } from "../../context/LocationContext";
import { useLanguage } from "../../context/LanguageContext";
import { themeStyles } from "../../styles/theme";
import { SectionCard, SecondaryButton } from "../../components/ui/AppPrimitives";

export default function MapScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const { t } = useLanguage();

  if (!location) {
    return (
      <View style={themeStyles.centered}>
        <Text style={[themeStyles.clueTitle, { marginBottom: 8 }]}>
          {t("map.noPositionTitle")}
        </Text>
        <SectionCard>
          <Text style={[themeStyles.clueDesc, { marginBottom: 10 }]}>
            {t("map.noPositionBody")}
          </Text>
          <SecondaryButton
            label={t("map.openHomeTab")}
            accessibilityLabel={t("map.openHomeTabA11y")}
            onPress={() => router.navigate("/(tabs)")}
          />
        </SectionCard>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        customMapStyle={antiqueMapStyle}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      />
    </View>
  );
}
