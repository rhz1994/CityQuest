import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { themeStyles } from "../../styles/theme";
import { useLocation } from "../../context/LocationContext";
import { useLanguage } from "../../context/LanguageContext";
import API_URL from "../../config/api";
import { getDistanceMeters } from "../../utilities/utils";
import {
  SectionCard,
  SecondaryButton,
  StatusChip,
} from "../../components/ui/AppPrimitives";
import { colors, radius, spacing } from "../../styles/tokens";

const QUICK_GUIDE_DISMISSED_KEY = "cityquest.quickguide.dismissed";

export default function HomeScreen() {
  type City = {
    cityId: number;
    cityName: string;
    latitude: number;
    longitude: number;
    cityImage: string | null;
  };

  const [cities, setCities] = useState<City[]>([]);
  const { location, setLocation } = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [showQuickGuide, setShowQuickGuide] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  const fetchCities = () => {
    setLoadingCities(true);
    setCitiesError(null);
    fetch(`${API_URL}/cities`)
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(() => setCitiesError(t("home.fetchCitiesError")))
      .finally(() => setLoadingCities(false));
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const loadGuideState = async () => {
      try {
        const dismissed = await AsyncStorage.getItem(QUICK_GUIDE_DISMISSED_KEY);
        if (dismissed === "true") {
          setShowQuickGuide(false);
        }
      } catch {
        // Native storage saknas i vissa runtime-lägen; kör utan persistent guide-state.
      }
    };
    loadGuideState();
  }, []);
  const handleDismissQuickGuide = async () => {
    setShowQuickGuide(false);
    try {
      await AsyncStorage.setItem(QUICK_GUIDE_DISMISSED_KEY, "true");
    } catch {
      // Ignore: appen fungerar även utan persistent lagring.
    }
  };


  // Hämta plats direkt när sidan monteras
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(t("home.permissionDenied"));
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setErrorMsg(null);
    })();
  }, [setLocation]);

  // hämtar närmaste stad genom att jämföra plats med data från api.
  function getNearestCity(lat: number, lon: number) {
    let minDist = Infinity;
    let nearest: City | null = null;
    for (const city of cities) {
      const dist = getDistanceMeters(lat, lon, city.latitude, city.longitude);
      if (dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }
    return nearest;
  }

  // hämtar plats när användaren trycker på knapp
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg(t("home.permissionDenied"));
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    setErrorMsg(null);
  };

  // renderar varje stad i listan som en knapp.
  const renderItem = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={themeStyles.button}
      accessibilityRole="button"
      accessibilityLabel={t("home.selectCityA11y", { city: item.cityName })}
      onPress={() =>
        router.push({ pathname: "/city", params: { city: item.cityName } })
      }
    >
      <Text style={themeStyles.buttonText}>{item.cityName}</Text>
    </TouchableOpacity>
  );

  const nearestCity =
    location && cities.length > 0
      ? getNearestCity(location.coords.latitude, location.coords.longitude)
      : null;

  return (
    <View style={themeStyles.container}>
      <View
        style={styles.logoContainer}
      >
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={themeStyles.title}>{t("home.title")}</Text>
      {showQuickGuide ? (
        <SectionCard title={t("home.quickStart")}>
          <Text style={[themeStyles.clueDesc, styles.quickGuideText]}>
            {t("home.quickStartSteps")}
          </Text>
          <SecondaryButton
            label={t("home.quickStartDismiss")}
            onPress={handleDismissQuickGuide}
            accessibilityLabel={t("home.quickStartDismissA11y")}
          />
        </SectionCard>
      ) : null}
      <TouchableOpacity
        style={themeStyles.button}
        accessibilityRole="button"
        accessibilityLabel={t("home.updateLocationA11y")}
        onPress={getLocation}
      >
        <Text style={themeStyles.buttonText}>{t("home.updateLocation")}</Text>
      </TouchableOpacity>
      {location && (
        <Text style={[themeStyles.clueDesc, styles.locationText]}>
          {t("home.latitude")}: {location.coords.latitude}
          {"\n"}
          {t("home.longitude")}: {location.coords.longitude}
        </Text>
      )}
      {errorMsg && <Text style={themeStyles.error}>{errorMsg}</Text>}
      {nearestCity ? (
        <StatusChip
          text={t("home.nearestCity", { city: nearestCity.cityName })}
          style={styles.nearestCityChip}
        />
      ) : null}
      {loadingCities ? (
        <ActivityIndicator color={colors.accentGoldSoft} size="large" />
      ) : null}
      {citiesError ? (
        <View style={styles.errorContainer}>
          <Text style={themeStyles.error}>{citiesError}</Text>
          <TouchableOpacity
            style={[themeStyles.solveButton, styles.retryButton]}
            onPress={fetchCities}
            accessibilityRole="button"
            accessibilityLabel={t("home.retryFetchCitiesA11y")}
          >
            <Text style={themeStyles.solveButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <FlatList
        ListEmptyComponent={
          !loadingCities && !citiesError ? (
            <Text style={themeStyles.clueDesc}>{t("home.emptyCities")}</Text>
          ) : null
        }
        data={nearestCity ? [nearestCity] : cities}
        renderItem={renderItem}
        keyExtractor={(item) => item.cityName}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 36,
    marginBottom: spacing.xl,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: colors.accentGold,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    alignSelf: "center",
    backgroundColor: colors.bgSurface,
    opacity: 0.92,
    padding: 16,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  quickGuideText: {
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  locationText: {
    marginBottom: spacing.xs,
  },
  nearestCityChip: {
    marginBottom: spacing.md,
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.xs,
  },
  listContent: {
    paddingVertical: 16,
  },
});
