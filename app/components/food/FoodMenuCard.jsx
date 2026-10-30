import AppIcon from "../shared/AppIcon";
import FoodItemImage from "./FoodItemImage";
import Link from "next/link";
import { getRestaurantById } from "../../lib/food-data";
import { formatPHP } from "../../lib/format";

export default function FoodMenuCard({ item, isFavorite, onToggleFavorite, onAddToCart }) {
  const restaurant = getRestaurantById(item.restaurantId);
  const isClosed = restaurant && !restaurant.isOpen;

  return (
    <article className="food-card">
      <div className={`food-art food-art-${item.tone}`}>
        <FoodItemImage item={item} fallbackClassName="food-emoji" sizes="(max-width: 800px) 50vw, 25vw" />
        <span className="rating-badge"><AppIcon name="star" size={12} /> {item.rating}</span>
        <button
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          aria-label={isFavorite ? `Remove ${item.title} from saved favorites` : `Save ${item.title} as a favorite`}
          aria-pressed={isFavorite}
        >
          <AppIcon name="heart" size={18} filled={isFavorite} />
        </button>
      </div>
      <div className="food-card-content">
        <div className="food-tags">
          <Link className="restaurant-tag restaurant-tag-link" href={`/restaurants/${item.restaurantId}`}>
            {item.restaurant}
          </Link>
          <span className="category-tag">{item.category}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="food-card-footer">
          <strong>{formatPHP(item.price)}</strong>
          <button className="add-button" type="button" disabled={isClosed} onClick={() => onAddToCart(item)} aria-label={isClosed ? `${item.restaurant} is closed` : `Customize ${item.title} before adding to cart`}>
            {isClosed ? <span className="add-button-closed">Closed</span> : <AppIcon name="plus" size={19} stroke={2.4} />}
          </button>
        </div>
      </div>
    </article>
  );
}
