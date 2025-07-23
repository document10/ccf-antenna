import Image from "next/image";
import MapComp from "./MapComp";
import { Suspense } from "react";
import { Metadata } from 'next'

export const metadata = {
  title: "Antenna CCF",
  description: "Get locations of antennas around the area.",
};

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
      <Suspense>
        <MapComp />
      </Suspense>
    </div>
  );
}
