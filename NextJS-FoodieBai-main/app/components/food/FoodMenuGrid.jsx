import AppIcon from "../shared/AppIcon";
import FoodMenuCard from "./FoodMenuCard";

export default function FoodMenuGrid({ items, favoriteIds, onToggleFavorite, onAddToCart }) {
  if (items.length === 0) {
    return (
      <div className="empty-results">
        <span className="empty-results-icon"><AppIcon name="search" size={24} /></span>
        <h3>No dishes found</h3>
        <p>Try a different search or switch up your filters.</p>
      </div>
    );
  }

  return (
    <div className="food-grid">
      {items.map((item) => (
        <FoodMenuCard
          key={item.id}
          item={item}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

