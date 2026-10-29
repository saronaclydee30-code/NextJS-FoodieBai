import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import AppIcon from "../../components/shared/AppIcon";
import FoodSearchField from "../../components/food/FoodSearchField";
import FoodFilterChip from "../../components/food/FoodFilterChip";

export default function MenuPageView({ search, setSearch, categories, category, setCategory, items, favoriteIds, onToggleFavorite, onAddToCart }) {
  return (
    <section className="subpage-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">FOODIEBAI MENU</span>
          <h1>Full Menu</h1>
          <p>Explore all our fresh &amp; tasty dishes</p>
        </div>
        <span className="subpage-sticker"><AppIcon name="sparkles" size={18} /> Made fresh</span>
      </div>
      <FoodSearchField value={search} onChange={setSearch} placeholder="Search menu..." />
      <div className="menu-browse-heading">
        <div>
          <h2>Find your kind of delicious</h2>
          <p>Pick a craving to narrow down the menu.</p>
        </div>
        <span className="menu-result-count">{items.length} {items.length === 1 ? "dish" : "dishes"}</span>
      </div>
      <div className="chip-row menu-category-row" aria-label="Filter menu by food category">
        {categories.map((name) => (
          <FoodFilterChip key={name} active={category === name} tone="green" onClick={() => setCategory(name)}>{name}</FoodFilterChip>
        ))}
      </div>
      <div className="menu-filter-note"><span>Made fresh from local favorites</span><span>Save a dish or add it straight to your cart</span></div>
      <FoodMenuGrid items={items} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
    </section>
  );
}
