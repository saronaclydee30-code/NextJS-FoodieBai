import RestaurantCard from "./RestaurantCard";

export default function RestaurantCardGrid({ restaurants, itemCounts = {} }) {
  return (
    <div className="restaurant-card-grid">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          itemCount={itemCounts[restaurant.id]}
        />
      ))}
    </div>
  );
}
