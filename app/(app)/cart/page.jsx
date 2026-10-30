"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFoodie } from "../../providers";
import CartPageView from "./CartPageView";
import CartOrderSuccessModal from "./CartOrderSuccessModal";
import { foodItems } from "../../lib/food-data";

export default function CartPage() {
  const router = useRouter();
  const {
    user,
    cartItems,
    deliverySettings,
    favoriteIds,
    toggleFavorite,
    changeQuantity,
    placeOrder,
    openCustomization,
  } = useFoodie();
  const [orderSuccess, setOrderSuccess] = useState(null);
  const suggestions = foodItems
    .filter((item) => !cartItems.some((cartItem) => cartItem.id === item.id))
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 4);

  const handlePlaceOrder = (checkoutDetails) => {
    const order = placeOrder(checkoutDetails);
    if (order) setOrderSuccess(order);
  };

  return (
    <>
      <CartPageView
        cartItems={cartItems}
        user={user}
        deliverySettings={deliverySettings}
        suggestions={suggestions}
        favoriteIds={favoriteIds}
        onChangeQuantity={changeQuantity}
        onPlaceOrder={handlePlaceOrder}
        onOpenMenu={() => router.push("/menu")}
        onRequireAccount={() => router.push("/auth/signup?returnTo=%2Fcart")}
        onAddToCart={openCustomization}
        onToggleFavorite={toggleFavorite}
      />
      <CartOrderSuccessModal
        order={orderSuccess}
        onTrack={() => {
          setOrderSuccess(null);
          router.push(`/orders/${orderSuccess.orderId}`);
        }}
        onContinue={() => {
          setOrderSuccess(null);
          router.push("/home");
        }}
      />
    </>
  );
}
