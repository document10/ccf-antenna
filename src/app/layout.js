import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { loadEnvConfig } from '@next/env'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Antenna CCF",
  description: "Get locations of antennas around the area.",
};

export default function RootLayout({ children }) {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
