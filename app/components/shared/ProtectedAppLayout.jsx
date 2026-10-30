"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFoodie } from "../../providers";
import AppNavigationShell from "./AppNavigationShell";

const publicStorefrontPaths = new Set(["/home", "/menu", "/cart"]);

export default function ProtectedAppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useFoodie();
  const isPublicStorefront =
    publicStorefrontPaths.has(pathname) || pathname.startsWith("/restaurants/");

  useEffect(() => {
    if (hydrated && !user && !isPublicStorefront) router.replace("/");
  }, [hydrated, user, isPublicStorefront, router]);

  if (!hydrated || (!user && !isPublicStorefront)) {
    return (
      <main className="app-screen">
        <div className="page-loading">Loading your FoodieBai space...</div>
      </main>
    );
  }

  return <AppNavigationShell>{children}</AppNavigationShell>;
}
