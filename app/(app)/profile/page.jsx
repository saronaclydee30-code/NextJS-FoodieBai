"use client";

import { useRouter } from "next/navigation";
import { useFoodie } from "../../providers";
import ProfilePageView from "./ProfilePageView";

export default function ProfilePage() {
  const router = useRouter();
  const { user, orders, favoriteIds, deliverySettings, logout } = useFoodie();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <ProfilePageView
      user={user}
      orders={orders}
      favoriteCount={favoriteIds.length}
      deliveryAddress={deliverySettings.deliveryAddress}
      phoneNumber={deliverySettings.phoneNumber}
      onLogout={handleLogout}
    />
  );
}
