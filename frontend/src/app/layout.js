import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "CityQuest",
  description: "Your adventure begins here...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-yellow-50 min-h-screen font-sans antialiased">
        <header className="mb-8 text-center py-8 bg-gray-900/95 shadow-lg rounded-b-2xl">
          <Image
            src="/CityQuestLogo.png"
            alt="CityQuest Logo"
            width={96}
            height={96}
            className="mx-auto mb-4 w-24 h-24 object-contain drop-shadow-lg"
            priority
          />
          <h1 className="text-yellow-400 font-extrabold text-3xl tracking-wider mb-2">
            Welcome to CityQuest!
          </h1>
          <p className="text-yellow-100 text-lg opacity-90">
            Your adventure begins here...
          </p>
        </header>
        {children}
      </body>
    </html>
  );
}
