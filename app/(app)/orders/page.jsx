"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isOrderCancellable, useFoodie } from "../../providers";
import OrdersPageView from "./OrdersPageView";
import { foodItems, getRestaurantById, restaurantSlug } from "../../lib/food-data";

export default function OrdersPage() {
  const router = useRouter();
  const {
    orders,
    cartItems,
    cancelOrder,
    removeOrder,
    replaceCartWithItems,
    showToast,
    submitReview,
  } = useFoodie();
  const [pendingBuyAgain, setPendingBuyAgain] = useState(null);

  const getAvailableItems = (order) =>
    order.items
      .map((item) => {
        const foodItem = foodItems.find((currentFoodItem) => currentFoodItem.id === item.id);
        return foodItem ? { ...foodItem, ...item } : item;
      })
      .filter((item) => {
        const restaurant = getRestaurantById(item.restaurantId || restaurantSlug(item.restaurant));
        return item.available !== false && restaurant?.isOpen !== false;
      });

  const handleBuyAgain = (order) => {
    const availableItems = getAvailableItems(order);
    if (!availableItems.length) {
      showToast("The items from this order are currently unavailable.");
      return;
    }

    const targetRestaurant = availableItems[0].restaurant;
    const hasDifferentRestaurant = cartItems.length > 0 && cartItems.some((item) => item.restaurant !== targetRestaurant);
    if (hasDifferentRestaurant) {
      setPendingBuyAgain({ ...order, items: availableItems, skippedCount: order.items.length - availableItems.length });
      return;
    }

    replaceCartWithItems(availableItems);
    if (availableItems.length < order.items.length) showToast("Unavailable items were skipped.");
    router.push("/cart");
  };

  const confirmBuyAgain = () => {
    if (!pendingBuyAgain) return;
    replaceCartWithItems(pendingBuyAgain.items);
    if (pendingBuyAgain.skippedCount > 0) showToast("Unavailable items were skipped.");
    setPendingBuyAgain(null);
    router.push("/cart");
  };

  return (
    <OrdersPageView
      orders={orders}
      canCancelOrder={isOrderCancellable}
      onCancelOrder={cancelOrder}
      onRemoveOrder={removeOrder}
      onOpenMenu={() => router.push("/menu")}
      onOpenTracking={(orderId) => router.push(`/orders/${orderId}`)}
      onBuyAgain={handleBuyAgain}
      pendingBuyAgain={pendingBuyAgain}
      onCloseBuyAgain={() => setPendingBuyAgain(null)}
      onConfirmBuyAgain={confirmBuyAgain}
      onSubmitReview={submitReview}
    />
  );
}
