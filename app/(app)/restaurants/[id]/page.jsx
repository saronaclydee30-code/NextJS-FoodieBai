import RestaurantPage from "./RestaurantPage";

export default async function Page({ params }) {
  const { id } = await params;
  return <RestaurantPage restaurantId={id} />;
}
