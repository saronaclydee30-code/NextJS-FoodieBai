import OrderTrackingPage from "./OrderTrackingPage";

export default async function Page({ params }) {
  const { id } = await params;
  return <OrderTrackingPage orderId={id} />;
}
