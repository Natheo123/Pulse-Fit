import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PulseFit",
  description:
    "Programmes intelligents, séances live, carte musculaire, nutrition et progression explicable.",
  applicationName: "PulseFit",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PulseFit",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050506" },
    { media: "(prefers-color-scheme: light)", color: "#050506" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#020203] text-foreground overscroll-none">
        <ThemeProvider>
          <div className="pf-app pf-phone pf-glow">{children}</div>
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
