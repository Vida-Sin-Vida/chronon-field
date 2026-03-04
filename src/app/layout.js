import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DesignerBadge from "../components/DesignerBadge";
import DisplayOverlay from "../components/DisplayOverlay";
import { GlobalProvider } from "../context/GlobalContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: '#F7F6F3',
  colorScheme: 'light only',
};

export const metadata = {
  title: "Chronon Field",
  description: "BRECHETEAU RESEARCH INSTITUT",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "Chronon Field",
    description: "BRECHETEAU RESEARCH INSTITUT explorant les mystères du temps.",
    url: "https://chronon-field.com",
    siteName: "Chronon Field",
    images: [
      {
        url: "/og-image.jpg", // Assumes an og-image exists or will exist
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}
      >
        <GlobalProvider>
          <DisplayOverlay />
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <DesignerBadge />
        </GlobalProvider>
      </body>
    </html>
  );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
