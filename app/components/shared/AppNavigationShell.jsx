"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFoodie } from "../../providers";
import FoodieBaiBrand from "./FoodieBaiBrand";
import AppIcon from "./AppIcon";

const navItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "menu", label: "Menu", icon: "menu" },
  { id: "saved", label: "Saved", icon: "bookmark" },
  { id: "cart", label: "Cart", icon: "cart" },
  { id: "orders", label: "Orders", icon: "package" },
  { id: "profile", label: "Profile", icon: "user" },
];

function isActiveRoute(pathname, id) {
  return pathname === `/${id}` || pathname.startsWith(`/${id}/`);
}

export default function AppNavigationShell({ children }) {
  const pathname = usePathname();
  const { user, cartCount } = useFoodie();
  const activeUser = user?.username || "FoodieUser";

  return (
    <main className="app-screen">
      <div className="app-frame">
        <header className="app-topbar">
          <FoodieBaiBrand compact />
          <div className="app-topbar-right">
            <span className="delivery-status"><span className="online-dot" /> Delivering to Metro Manila</span>
            <Link
              className={`settings-link ${isActiveRoute(pathname, "settings") ? "settings-link-active" : ""}`}
              href="/settings"
              aria-label="Open settings"
              aria-current={isActiveRoute(pathname, "settings") ? "page" : undefined}
            >
              <AppIcon name="settings" size={19} />
              <span>Settings</span>
            </Link>
            <Link className="top-avatar" href="/profile" aria-label="Open profile">{activeUser.slice(0, 1).toUpperCase()}</Link>
          </div>
        </header>
        <div className="app-content">{children}</div>
        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.id);
            return (
              <Link
                className={`nav-item ${active ? "nav-item-active" : ""}`}
                href={`/${item.id}`}
                key={item.id}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav-icon-wrap">
                  <AppIcon name={item.icon} size={21} filled={item.id === "saved" && active} />
                  {item.id === "cart" && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
