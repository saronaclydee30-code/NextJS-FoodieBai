import { categories, restaurants } from "../../lib/food-data";
import FoodFilterChip from "../../components/food/FoodFilterChip";
import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import AppIcon from "../../components/shared/AppIcon";
import FoodSearchField from "../../components/food/FoodSearchField";
import PageSectionHeading from "../../components/food/PageSectionHeading";
import FoodItemImage from "../../components/food/FoodItemImage";

export default function HomePageView({
  search,
  setSearch,
  username,
  restaurant,
  setRestaurant,
  category,
  setCategory,
  items,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onOpenMenu,
}) {
  const featuredItem = [...items].sort((first, second) => second.rating - first.rating)[0];

  return (
    <section className="home-view">
      <div className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">GOOD FOOD, GOOD MOOD</span>
          <h1>What sounds good?</h1>
          <p>{username ? `${username}, your ` : "Your "}next delicious find is waiting.</p>
        </div>
        <div className="utensils-bubble" aria-label="Spoon and fork logo">
          <AppIcon name="utensils" size={32} />
        </div>
        <FoodSearchField value={search} onChange={setSearch} placeholder="Search Jollibee, McDo, KFC..." />
      </div>

      <div className="home-content">
        <div className="promo-card">
          <div className="promo-card-copy">
            <span className="promo-eyebrow">TODAY&apos;S SPECIAL</span>
            <h2>Top Fast Food<br />Favorites Delivered!</h2>
            <button className="text-link" type="button" onClick={onOpenMenu}>Explore full menu <AppIcon name="chevronRight" size={15} /></button>
          </div>
          <div className="promo-food" aria-hidden="true">🍔</div>
          <span className="promo-spark" aria-hidden="true">✦</span>
        </div>

        {featuredItem && (
          <article className="home-pick-card">
            <div className={`home-pick-art food-art-${featuredItem.tone}`} aria-hidden="true">
              <FoodItemImage item={featuredItem} fallbackClassName="food-emoji" sizes="82px" />
            </div>
            <div className="home-pick-copy">
              <span className="home-pick-eyebrow"><AppIcon name="sparkles" size={14} /> A GOOD PLACE TO START</span>
              <h2>{featuredItem.title}</h2>
              <p>{featuredItem.restaurant} <span>·</span> {featuredItem.category} <span>·</span> <AppIcon name="star" size={13} /> {featuredItem.rating}</p>
            </div>
            <div className="home-pick-action">
              <strong>₱{featuredItem.price}</strong>
              <button className="primary-button" type="button" onClick={() => onAddToCart(featuredItem)}>
                Add to cart <AppIcon name="plus" size={16} />
              </button>
            </div>
          </article>
        )}

        <PageSectionHeading title="Popular Fast Foods & Spots" subtitle="Select a restaurant to filter dishes" />
        <div className="chip-row" aria-label="Restaurants">
          {restaurants.map((name) => (
            <FoodFilterChip key={name} active={restaurant === name} onClick={() => setRestaurant(name)}>{name}</FoodFilterChip>
          ))}
        </div>

        <div className="category-heading">Food Category</div>
        <div className="chip-row category-row" aria-label="Food categories">
          {categories.map((name) => (
            <FoodFilterChip key={name} active={category === name} tone="green" onClick={() => setCategory(name)}>{name}</FoodFilterChip>
          ))}
        </div>

        <PageSectionHeading title="Featured Dishes" subtitle="Fresh & hot from kitchen" count={items.length} />
        <FoodMenuGrid items={items} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
      </div>
    </section>
  );
}
