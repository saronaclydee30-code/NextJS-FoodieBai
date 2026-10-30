"use client";

import Image from "next/image";
import { useState } from "react";
import { categories, restaurants } from "../../lib/food-data";
import { promoDeals } from "../../lib/promo-deals";
import useScrollReveal from "../../hooks/useScrollReveal";
import FoodFilterChip from "../../components/food/FoodFilterChip";
import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import AppIcon from "../../components/shared/AppIcon";
import FoodSearchField from "../../components/food/FoodSearchField";
import PageSectionHeading from "../../components/food/PageSectionHeading";
import FoodItemImage from "../../components/food/FoodItemImage";
import RestaurantCardGrid from "../../components/food/RestaurantCardGrid";
import { formatPHP } from "../../lib/format";

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
  restaurantProfiles,
  onOpenMenu,
}) {
  const featuredItem = [...items].sort((first, second) => second.rating - first.rating)[0];
  const [activeDeal, setActiveDeal] = useState(0);
  const promoDealsRef = useScrollReveal();

  return (
    <section className="home-view">
      <div className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">GOOD FOOD, GOOD MOOD</span>
          <h1>What sounds good?</h1>
          <p>{username ? `${username}, your ` : "Your "}next delicious find is waiting.</p>
        </div>
        <div className="utensils-bubble" aria-label="Spoon and fork logo"><AppIcon name="utensils" size={32} /></div>
        <FoodSearchField value={search} onChange={setSearch} placeholder="Search Jollibee, McDo, KFC..." />
      </div>

      <div className="home-content">
        <div className="promo-card">
          <section className="promo-feature-panel" aria-label="Today's special">
            <div className="promo-feature-copy"><span className="promo-eyebrow">TODAY&apos;S SPECIAL</span><h2>Top Fast Food Favorites Delivered!</h2><button className="promo-feature-cta" type="button" onClick={onOpenMenu}>Explore full menu <AppIcon name="chevronRight" size={16} /></button></div>
            <div className="promo-feature-image"><Image className="promo-food-image" src="/promo-fries-cutout.png" alt="Golden fries served in a red carton" width={481} height={321} priority /></div>
          </section>
          <section ref={promoDealsRef} className="promo-deal-panel" aria-label="Discount deals">
            <div className="promo-deals-viewport" aria-live="polite"><article className="promo-deal" key={promoDeals[activeDeal].code}><span className="promo-eyebrow">TODAY&apos;S DEALS</span><h2>{promoDeals[activeDeal].title}</h2><p>{promoDeals[activeDeal].description}</p><span className="promo-deal-code">Use code <strong>{promoDeals[activeDeal].code}</strong></span></article></div>
            <div className="promo-deal-controls"><span aria-label={`Deal ${activeDeal + 1} of ${promoDeals.length}`}>{activeDeal + 1} / {promoDeals.length}</span><button type="button" aria-label="Previous discount deal" onClick={() => setActiveDeal((current) => (current - 1 + promoDeals.length) % promoDeals.length)}><AppIcon name="back" size={17} /></button><button type="button" aria-label="Next discount deal" onClick={() => setActiveDeal((current) => (current + 1) % promoDeals.length)}><AppIcon name="chevronRight" size={17} /></button></div>
          </section>
        </div>

        <PageSectionHeading title="Popular restaurants" subtitle="Tap a restaurant to view its full menu" />
        <RestaurantCardGrid restaurants={restaurantProfiles.slice(0, 6)} />

        {featuredItem && (
          <article className="home-pick-card">
            <div className={`home-pick-art food-art-${featuredItem.tone}`} aria-hidden="true"><FoodItemImage item={featuredItem} fallbackClassName="food-emoji" sizes="82px" /></div>
            <div className="home-pick-copy"><span className="home-pick-eyebrow"><AppIcon name="sparkles" size={14} /> A GOOD PLACE TO START</span><h2>{featuredItem.title}</h2><p>{featuredItem.restaurant} <span>·</span> {featuredItem.category} <span>·</span> <AppIcon name="star" size={13} /> {featuredItem.rating}</p></div>
            <div className="home-pick-action"><strong>{formatPHP(featuredItem.price)}</strong><button className="primary-button" type="button" onClick={() => onAddToCart(featuredItem)}>Customize and add <AppIcon name="plus" size={16} /></button></div>
          </article>
        )}

        <PageSectionHeading title="Popular Fast Foods & Spots" subtitle="Select a restaurant to filter dishes" />
        <div className="chip-row" aria-label="Restaurants">{restaurants.map((name) => <FoodFilterChip key={name} active={restaurant === name} onClick={() => setRestaurant(name)}>{name}</FoodFilterChip>)}</div>
        <div className="category-heading">Food Category</div>
        <div className="chip-row category-row" aria-label="Food categories">{categories.map((name) => <FoodFilterChip key={name} active={category === name} tone="green" onClick={() => setCategory(name)}>{name}</FoodFilterChip>)}</div>
        <PageSectionHeading title="Featured Dishes" subtitle="Fresh & hot from kitchen" count={items.length} />
        <FoodMenuGrid items={items} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
      </div>
    </section>
  );
}
