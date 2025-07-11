import MapSel from "./MapSel";
import { Suspense } from "react";
export const metadata = {
  title: "Antenna CCF",
  description: "Get locations of antennas around the area.",
};

export default function Playground() {
  return (
    <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
      <Suspense>
        <MapSel />
      </Suspense>
    </div>
  );
}
