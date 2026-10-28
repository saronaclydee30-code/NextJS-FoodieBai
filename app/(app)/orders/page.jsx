"use client";

import { useRouter } from "next/navigation";
import { useFoodie } from "../../providers";
import OrdersPageView from "./OrdersPageView";

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useFoodie();
  return <OrdersPageView orders={orders} onOpenMenu={() => router.push("/menu")} />;
}

