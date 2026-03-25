// API base URL — set EXPO_PUBLIC_API_URL in your .env file
// During local development, use your computer's LAN IP (not localhost):
//   Windows: run `ipconfig` and use the IPv4 address, e.g. http://192.168.1.X:5000
//   Mac/Linux: run `ifconfig` and use the inet address
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

export default API_URL;
