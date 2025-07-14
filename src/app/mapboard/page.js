'use client';
import MapEdit from "./MapEdit";
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation'

export default function MapBoard() {
  const searchParams = useSearchParams();
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return (
      <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
        <p className="text-red-500">Access denied. Incorrect or missing password.</p>
      </div>
    );
  }
  else return (
    <div className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]">
      <Suspense>
        <MapEdit />
      </Suspense>
    </div>
  );
}
