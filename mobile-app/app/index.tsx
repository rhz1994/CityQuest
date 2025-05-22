import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { themeStyles } from "../styles/theme";

export default function HomeScreen() {
  const [cities, setCities] = useState<
    { cityName: string; latitude: number; longitude: number }[]
  >([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://192.168.1.110:5000/cities")
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
      style={themeStyles.button}
      onPress={() => router.push({ pathname: "/city", params: { city: item } })}
    >
      <Text style={themeStyles.buttonText}>{item}</Text>
    </TouchableOpacity>
  );

  const nearestCity =
    location && cities.length > 0
      ? getNearestCity(location.coords.latitude, location.coords.longitude)
      : null;

  return (
    <View style={themeStyles.container}>
      <Image
        source={require(`../assets/images/icon.png`)}
        style={{ width: 120, height: 120, marginBottom: 24 }}
        resizeMode="contain"
      />

      <Text style={themeStyles.title}>Välj stad</Text>

      <TouchableOpacity style={themeStyles.button} onPress={getLocation}>
        <Text style={themeStyles.buttonText}>Hämta min position</Text>
      </TouchableOpacity>

      {location && (
        <Text style={[themeStyles.clueDesc, { marginBottom: 8 }]}>
          Latitud: {location.coords.latitude}
          {"\n"}
          Longitud: {location.coords.longitude}
        </Text>
      )}
      {errorMsg && <Text style={themeStyles.error}>{errorMsg}</Text>}
      {nearestCity && (
        <Text style={[themeStyles.clueTitle, { marginBottom: 12 }]}>
          Närmaste stad: {nearestCity.cityName}
        </Text>
      )}
      <FlatList
        data={nearestCity ? [nearestCity.cityName] : []}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}
