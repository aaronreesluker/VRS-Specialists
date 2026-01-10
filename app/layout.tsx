import type { Metadata } from "next";
import { Inter, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import { LocalBusinessSchema } from "@/components/schema";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "VRS - Vehicle Rejuvenation Specialists | Premium Car Detailing Brighton",
    template: "%s | VRS Specialists",
  },
  description: "Premium car detailing, paint correction, ceramic coating and PPF services in Brighton and across Sussex. Studio workshop and mobile detailing. Insured and certified.",
  keywords: ["car detailing Brighton", "paint correction", "ceramic coating", "PPF", "mobile car detailing", "vehicle detailing Sussex"],
  authors: [{ name: "VRS Specialists" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.vrsspecialists.com",
    siteName: "VRS Specialists",
    title: "VRS - Vehicle Rejuvenation Specialists | Premium Car Detailing Brighton",
    description: "Premium car detailing, paint correction, ceramic coating and PPF services in Brighton and across Sussex.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VRS - Vehicle Rejuvenation Specialists",
    description: "Premium car detailing services in Brighton and Sussex",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${outfit.variable}`}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body>
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileCTA />
      </body>
    </html>
  );
}

