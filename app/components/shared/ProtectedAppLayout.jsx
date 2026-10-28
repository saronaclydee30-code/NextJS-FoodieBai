"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFoodie } from "../../providers";
import AppNavigationShell from "./AppNavigationShell";

export default function ProtectedAppLayout({ children }) {
  const router = useRouter();
  const { user, hydrated } = useFoodie();

  useEffect(() => {
    if (hydrated && !user) router.replace("/");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <main className="app-screen">
        <div className="page-loading">Loading your FoodieBai space...</div>
      </main>
    );
  }

  return <AppNavigationShell>{children}</AppNavigationShell>;
}

