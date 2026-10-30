import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import AppIcon from "../../components/shared/AppIcon";
import FoodSearchField from "../../components/food/FoodSearchField";
import FoodFilterChip from "../../components/food/FoodFilterChip";
import RestaurantCardGrid from "../../components/food/RestaurantCardGrid";
import PageSectionHeading from "../../components/food/PageSectionHeading";

export default function MenuPageView({
  search,
  setSearch,
  categories,
  category,
  setCategory,
  restaurants,
  restaurant,
  setRestaurant,
  sortBy,
  setSortBy,
  items,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  restaurantProfiles,
}) {
  return (
    <section className="subpage-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">FOODIEBAI MENU</span>
          <h1>Full Menu</h1>
          <p>Explore all our fresh &amp; tasty dishes</p>
        </div>
        <span className="subpage-sticker">
          <AppIcon name="sparkles" size={18} /> Made fresh
        </span>
      </div>
      <FoodSearchField
        value={search}
        onChange={setSearch}
        placeholder="Search menu..."
      />
      <PageSectionHeading title="Browse restaurants" subtitle="Open a restaurant to see its full menu" />
      <RestaurantCardGrid restaurants={restaurantProfiles} />
      <div className="menu-browse-heading">
        <div>
          <h2>Find your kind of delicious</h2>
          <p>Pick a craving to narrow down the menu.</p>
        </div>
        <span className="menu-result-count">
          {items.length} {items.length === 1 ? "dish" : "dishes"}
        </span>
      </div>
      <div className="menu-refine-controls">
        <label>
          <span>Restaurant</span>
          <select
            value={restaurant}
            onChange={(event) => setRestaurant(event.target.value)}
          >
            {restaurants.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="popular">Recommended</option>
            <option value="rating">Top rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div
        className="chip-row menu-category-row"
        aria-label="Filter menu by food category"
      >
        {categories.map((name) => (
          <FoodFilterChip
            key={name}
            active={category === name}
            tone="green"
            onClick={() => setCategory(name)}
          >
            {name}
          </FoodFilterChip>
        ))}
      </div>
      <div className="menu-filter-note">
        <span>Made fresh from local favorites</span>
        <span>Save a dish or add it straight to your cart</span>
      </div>
      <FoodMenuGrid
        items={items}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
      />
    </section>
  );
}
