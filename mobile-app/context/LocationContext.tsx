import React, { createContext, useContext, useState, ReactNode } from "react";

type LocationContextType = {
  location: any;
  setLocation: (loc: any) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function LocationProvider({ children }: Props) {
  const [location, setLocation] = useState(null);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
