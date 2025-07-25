import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { loadEnvConfig } from '@next/env'
import { Metadata } from 'next'

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
  loadEnvConfig(process.cwd())
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:title" content={metadata.title}/>
        <meta name="og:description" content={metadata.description}/>
        <title>{metadata.title}</title>
        <link rel='preconnect' href="https://maps.googleapis.com"/>
        <link rel='preconnect' href="https://maps.gstatic.com"/>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
