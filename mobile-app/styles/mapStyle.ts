export const antiqueMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#e7dbc3" }] }, // Ljus pergament
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5ecd6" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7c5c27" }] }, // Brun/guld text
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b6b6a8" }], // Dämpad blå/grå
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#e7dbc3" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#d6c7a1" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#cab98b" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7c5c27" }],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7c5c27" }],
  },
  // Gör kartan tydligare:
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#a67c52" }, { weight: 1.2 }],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "on" }],
  },
  // Ta bort onödiga element för antik känsla:
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
];
