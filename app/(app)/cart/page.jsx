"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFoodie } from "../../providers";
import CartPageView from "./CartPageView";
import CartOrderSuccessModal from "./CartOrderSuccessModal";
import { foodItems } from "../../lib/food-data";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, favoriteIds, toggleFavorite, changeQuantity, placeOrder, addToCart } = useFoodie();
  const [orderSuccess, setOrderSuccess] = useState(null);
  const suggestions = foodItems
    .filter((item) => !cartItems.some((cartItem) => cartItem.id === item.id))
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 4);

  const handlePlaceOrder = () => {
    const order = placeOrder();
    if (order) setOrderSuccess(order);
  };

  return (
    <>
      <CartPageView
        cartItems={cartItems}
        suggestions={suggestions}
        favoriteIds={favoriteIds}
        onChangeQuantity={changeQuantity}
        onPlaceOrder={handlePlaceOrder}
        onOpenMenu={() => router.push("/menu")}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
      />
      <CartOrderSuccessModal
        order={orderSuccess}
        onTrack={() => {
          setOrderSuccess(null);
          router.push("/orders");
        }}
        onContinue={() => {
          setOrderSuccess(null);
          router.push("/home");
        }}
      />
    </>
  );
}
