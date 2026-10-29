"use client";

import { useRouter } from "next/navigation";
import { isOrderCancellable, useFoodie } from "../../providers";
import OrdersPageView from "./OrdersPageView";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, cancelOrder, removeOrder } = useFoodie();
  return (
    <OrdersPageView
      orders={orders}
      canCancelOrder={isOrderCancellable}
      onCancelOrder={cancelOrder}
      onRemoveOrder={removeOrder}
      onOpenMenu={() => router.push("/menu")}
    />
  );
}
