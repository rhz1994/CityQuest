import { Slot } from "expo-router";
// import { AuthProvider } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import { LanguageProvider } from "../context/LanguageContext";

export default function RootLayout() {
  return (
    // <AuthProvider>
    <LanguageProvider>
      <LocationProvider>
        <Slot />
      </LocationProvider>
    </LanguageProvider>
    // </AuthProvider>
  );
}
