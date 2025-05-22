import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [cities, setCities] = useState<
    { cityName: string; latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    fetch("http://192.168.1.110:5000/cities") // byt till din backend-URL
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  function getNearestCity(lat: number, lon: number) {
    let minDist = Infinity;
    let nearest = null;
    for (const city of cities) {
      const dist = Math.sqrt(
        Math.pow(city.latitude - lat, 2) + Math.pow(city.longitude - lon, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }
    return nearest;
  }

  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Tillstånd nekades");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    setErrorMsg(null);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.cityButton}
      onPress={() => router.push({ pathname: "/city", params: { city: item } })}
    >
      <Text style={styles.cityButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  const nearestCity =
    location && cities.length > 0
      ? getNearestCity(location.coords.latitude, location.coords.longitude)
      : null;

  console.log(cities);

  return (
    <View style={styles.container}>
      <Image
        source={require(`../assets/images/icon.png`)}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.cityButton} onPress={getLocation}>
        <Text>Hämta min position</Text>
      </TouchableOpacity>
      {location && (
        <Text style={{ color: "#fff", marginBottom: 12 }}>
          Latitud: {location.coords.latitude}
          {"\n"}
          Longitud: {location.coords.longitude}
        </Text>
      )}
      {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}
      {nearestCity && (
        <Text style={{ color: "#FFD700", marginBottom: 12 }}>
          Närmaste stad: {nearestCity.cityName}
        </Text>
      )}
      <FlatList
        data={nearestCity ? [nearestCity.cityName] : []}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
    paddingTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
  },
  cityButton: {
    backgroundColor: "#ca8a04",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: 240,
    alignItems: "center",
  },
  cityButtonText: { color: "#1f2937", fontWeight: "700", fontSize: 18 },
});
