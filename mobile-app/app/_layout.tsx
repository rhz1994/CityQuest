import { Slot } from "expo-router";
// import { AuthProvider } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";

export default function RootLayout() {
  return (
    // <AuthProvider>
    <LocationProvider>
      <Slot />
    </LocationProvider>
    // </AuthProvider>
  );
}
