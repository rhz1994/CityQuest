import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { themeStyles } from "../../styles/theme";
import { useLocation } from "../../context/LocationContext";

export default function HomeScreen() {
  type City = {
    cityName: string;
    latitude: number;
    longitude: number;
  };

  const [cities, setCities] = useState<City[]>([]);
  const { location, setLocation } = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://192.168.1.110:5000/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  // Hämta plats direkt när sidan monteras

  useEffect(() => {
    (async () => {
      let { status } = await location.requestForegroundPermissionAsync();
      if (status !== "granted") {
        setErrorMsg("Tillstånd nekandes");
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
    let nearest = null;
    for (const city of cities) {
      const dist = Math.sqrt(
        Math.pow(city.latitude - lat, 2) + Math.pow(city.longitude - lon, 2)
      );
      if (dist < minDist) {
        (minDist = dist), (nearest = city);
      }
    }
    return nearest;
  }

  // hämtar plats när användaren trycker på knapp

  const getLocation = async () => {
    let { status } = await Location.RequestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Tillstånd nekades");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    setErrorMsg;
  };

  // renderar varje stad i listan som en knapp.
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={themeStyles.button}
      onPress={() => router.push({ pathname: "/city", params: { city: item } })}
    >
      {" "}
      <Text style={themeStyles.buttonText}>{item}</Text>
    </TouchableOpacity>
  );

  const nearestCity =
    location && cities.length > 0
      ? getNearestCity(location.coords.latitude, location.coords.longitude)
      : null;

  return (
    <View style={themeStyles.container}>
      <View
        style={{
          marginTop: 36,
          marginBottom: 18,
          borderRadius: 80,
          borderWidth: 2,
          borderColor: "#bfa76a",
          shadowColor: "#000",
          shadowOpacity: 0.28,
          shadowRadius: 18,
          alignSelf: "center",
          backgroundColor: "rgba(24,25,26,0.92)",
          padding: 16,
        }}
      >
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 110, height: 110, borderRadius: 55 }}
          resizeMode="contain"
        />
      </View>
      <Text style={themeStyles.title}>Välj stad</Text>
      <TouchableOpacity style={themeStyles.button} onPress={getLocation}>
        <Text style={themeStyles.buttonText}>Uppdatera min position</Text>
      </TouchableOpacity>{" "}
      {location && (
        <Text style={[themeStyles.clueDesc, { marginBottom: 8 }]}>
          Latitud: {location.coords.latitude}
          {"\n"}
          Longitud: {location.coords.longitude}
        </Text>
      )}{" "}
      {errorMsg && <Text style={themeStyles.error}>{errorMsg}</Text>}{" "}
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
