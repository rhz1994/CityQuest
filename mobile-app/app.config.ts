import { ExpoConfig, ConfigContext } from "expo/config";
import appJson from "./app.json";

export default ({ config }: ConfigContext): ExpoConfig => {
  const baseConfig = appJson.expo as ExpoConfig;
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  return {
    ...config,
    ...baseConfig,
    ios: {
      ...baseConfig.ios,
      config: {
        ...baseConfig.ios?.config,
        googleMapsApiKey,
      },
    },
    android: {
      ...baseConfig.android,
      config: {
        ...baseConfig.android?.config,
        googleMaps: {
          ...baseConfig.android?.config?.googleMaps,
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
