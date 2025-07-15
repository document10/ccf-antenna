import MapSel from "./MapSel";
import { Suspense } from "react";
export default function Playground() {
  return (
    <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
      <Suspense>
        <MapSel />
      </Suspense>
    </div>
  );
}
