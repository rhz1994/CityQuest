import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { antiqueMapStyle } from "../../styles/mapStyle";
import { useLocation } from "../../context/LocationContext";

export default function MapScreen() {
  const { location } = useLocation();

  if (!location) {
    return (
      <View style={{ flex: 1 }}>
        {/* Visa loading eller default-region här om så önskas */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        customMapStyle={antiqueMapStyle}
        provider="google"
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
