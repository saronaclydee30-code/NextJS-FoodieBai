import AppIcon from "../shared/AppIcon";

export default function FoodMenuCard({ item, isFavorite, onToggleFavorite, onAddToCart }) {
  return (
    <article className="food-card">
      <div className={`food-art food-art-${item.tone}`}>
        <span className="food-art-glow" />
        <span className="food-emoji" aria-hidden="true">{item.emoji}</span>
        <span className="food-art-dot dot-one" />
        <span className="food-art-dot dot-two" />
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
          <span className="restaurant-tag">{item.restaurant}</span>
          <span className="category-tag">{item.category}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="food-card-footer">
          <strong>₱{item.price}</strong>
          <button className="add-button" type="button" onClick={() => onAddToCart(item)} aria-label={`Add ${item.title} to cart`}>
            <AppIcon name="plus" size={19} stroke={2.4} />
          </button>
        </div>
      </div>
    </article>
  );
}

