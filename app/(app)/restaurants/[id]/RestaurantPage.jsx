"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import AppIcon from "../../../components/shared/AppIcon";
import FoodItemImage from "../../../components/food/FoodItemImage";
import { useFoodie } from "../../../providers";
import { foodItems, getRestaurantById } from "../../../lib/food-data";
import { formatPHP } from "../../../lib/format";

const tabs = ["Menu", "Info", "Reviews"];

function ReviewSummary({ rating, reviewCount }) {
  return (
    <span className="restaurant-review-summary">
      <AppIcon name="star" size={15} /> {rating.toFixed(1)} {reviewCount ? `(${reviewCount} reviews)` : "(No reviews yet)"}
    </span>
  );
}

function RestaurantMenuItem({ item, isFavorite, isClosed, onToggleFavorite, onCustomize }) {
  return (
    <article className="restaurant-menu-item">
      <div className={`restaurant-menu-item-art food-art-${item.tone}`}>
        <FoodItemImage item={item} fallbackClassName="food-emoji" sizes="120px" />
      </div>
      <div className="restaurant-menu-item-copy">
        <div className="restaurant-menu-item-topline">
          <span className="restaurant-item-rating"><AppIcon name="star" size={11} /> {item.rating}</span>
          <button className={`restaurant-item-save${isFavorite ? " is-favorite" : ""}`} type="button" onClick={() => onToggleFavorite(item.id)} aria-label={isFavorite ? `Remove ${item.title} from saved items` : `Save ${item.title}`} aria-pressed={isFavorite}>
            <AppIcon name="heart" size={17} filled={isFavorite} />
          </button>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="restaurant-menu-item-bottom">
          <strong>{formatPHP(item.price)}</strong>
          <button className="restaurant-add-button" type="button" disabled={isClosed} onClick={() => onCustomize(item)}>
            {isClosed ? "Closed" : "Add"} {!isClosed && <AppIcon name="plus" size={15} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function ReviewList({ reviews }) {
  if (!reviews.length) {
    return (
      <div className="restaurant-empty-state">
        <AppIcon name="star" size={26} />
        <h3>No reviews yet</h3>
        <p>Be the first customer to share a review after your delivery.</p>
      </div>
    );
  }

  return (
    <div className="restaurant-review-list">
      {reviews.map((review) => (
        <article className="restaurant-review-card" key={review.id || `${review.name}-${review.date}`}>
          <div className="restaurant-review-card-topline">
            <div>
              <strong>{review.author || review.name}</strong>
              <span>{review.date}</span>
            </div>
            <span className="restaurant-review-stars" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => <AppIcon key={index} name="star" size={13} filled={index < review.rating} />)}
            </span>
          </div>
          <p>{review.comment}</p>
          {review.tags?.length ? (
            <div className="restaurant-review-tags">
              {review.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default function RestaurantPage({ restaurantId }) {
  const restaurant = getRestaurantById(restaurantId);
  const { favoriteIds, toggleFavorite, openCustomization, reviews } = useFoodie();
  const [activeTab, setActiveTab] = useState("Menu");
  const [activeCategory, setActiveCategory] = useState("Best Sellers");

  const restaurantItems = useMemo(
    () => foodItems.filter((item) => item.restaurantId === restaurant?.id),
    [restaurant?.id],
  );
  const menuSections = useMemo(() => {
    const bestSellers = [...restaurantItems]
      .sort((first, second) => second.rating - first.rating)
      .slice(0, 4);
    return {
      "Best Sellers": bestSellers,
      Meals: restaurantItems.filter((item) => item.category !== "Drinks"),
      Drinks: restaurantItems.filter((item) => item.category === "Drinks"),
    };
  }, [restaurantItems]);
  const userReviews = reviews.filter((review) => review.restaurantId === restaurant?.id);
  const allReviews = [...(restaurant?.reviews || []), ...userReviews];
  const averageRating = allReviews.length
    ? allReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / allReviews.length
    : restaurant?.rating || 0;

  if (!restaurant) {
    return (
      <section className="subpage-view restaurant-not-found">
        <div className="empty-panel">
          <h2>Restaurant not found</h2>
          <p>That restaurant is not available in this catalog.</p>
          <Link className="primary-button" href="/menu">Back to menu <AppIcon name="arrowRight" size={17} /></Link>
        </div>
      </section>
    );
  }

  const currentItems = menuSections[activeCategory] || [];

  return (
    <section className="subpage-view restaurant-detail-view">
      <Link className="restaurant-back-link" href="/menu"><AppIcon name="back" size={16} /> Back to restaurants</Link>
      <article className="restaurant-detail-card">
        <div className="restaurant-detail-cover">
          <Image src={restaurant.coverImage} alt="" fill priority sizes="(max-width: 800px) 100vw, 1240px" />
          <div className="restaurant-detail-cover-overlay" />
          <span className={`restaurant-open-badge${restaurant.isOpen ? "" : " restaurant-closed"}`}><span /> {restaurant.isOpen ? "Open now" : "Closed"}</span>
        </div>
        <div className="restaurant-detail-heading">
          <div>
            <span className="section-eyebrow">LOCAL FAVORITE</span>
            <h1>{restaurant.name}</h1>
            <p>{restaurant.cuisine} · {restaurant.description}</p>
            <div className="restaurant-detail-meta">
              <ReviewSummary rating={averageRating} reviewCount={allReviews.length} />
              <span><AppIcon name="clock" size={15} /> {restaurant.deliveryTime}</span>
              <span><AppIcon name="scooter" size={15} /> {formatPHP(restaurant.deliveryFee)} delivery</span>
            </div>
          </div>
          <div className="restaurant-detail-status">
            <strong>{restaurant.isOpen ? "Ready to take your order" : "Ordering is paused"}</strong>
            <small>{restaurant.hours}</small>
          </div>
        </div>
      </article>

      <div className="restaurant-detail-tabs" role="tablist" aria-label="Restaurant details">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab}
            {tab === "Reviews" && <span>{allReviews.length}</span>}
          </button>
        ))}
      </div>

      {activeTab === "Menu" && (
        <>
          <nav className="restaurant-category-tabs" aria-label="Menu categories">
            {Object.keys(menuSections).map((category) => (
              <button key={category} className={activeCategory === category ? "active" : ""} type="button" onClick={() => setActiveCategory(category)}>
                {category} <span>{menuSections[category].length}</span>
              </button>
            ))}
          </nav>
          <div className="restaurant-menu-heading">
            <div>
              <span className="section-eyebrow">{restaurant.isOpen ? "MADE FRESH FOR YOU" : "COME BACK SOON"}</span>
              <h2>{activeCategory}</h2>
            </div>
            {!restaurant.isOpen && <span className="restaurant-closed-note">Items are view-only while closed</span>}
          </div>
          <div className="restaurant-menu-list">
            {currentItems.length ? currentItems.map((item) => (
              <RestaurantMenuItem
                key={item.id}
                item={item}
                isFavorite={favoriteIds.includes(item.id)}
                isClosed={!restaurant.isOpen}
                onToggleFavorite={toggleFavorite}
                onCustomize={openCustomization}
              />
            )) : (
              <div className="restaurant-empty-state"><h3>No items in this section</h3><p>Try another menu category.</p></div>
            )}
          </div>
        </>
      )}

      {activeTab === "Info" && (
        <section className="restaurant-info-panel">
          <div className="restaurant-info-card"><span><AppIcon name="pin" size={20} /></span><div><strong>Address</strong><p>{restaurant.address}</p></div></div>
          <div className="restaurant-info-card"><span><AppIcon name="clock" size={20} /></span><div><strong>Hours</strong><p>{restaurant.hours}</p></div></div>
          <div className="restaurant-info-card"><span><AppIcon name="scooter" size={20} /></span><div><strong>Delivery details</strong><p>{restaurant.deliveryTime} · {formatPHP(restaurant.deliveryFee)} delivery fee</p></div></div>
          <div className="restaurant-info-card"><span><AppIcon name="utensils" size={20} /></span><div><strong>About this restaurant</strong><p>{restaurant.description} Prices may vary by restaurant.</p></div></div>
        </section>
      )}

      {activeTab === "Reviews" && (
        <section className="restaurant-reviews-panel">
          <div className="restaurant-reviews-heading">
            <div><span className="restaurant-big-rating">{averageRating.toFixed(1)}</span><span className="restaurant-review-stars">{Array.from({ length: 5 }, (_, index) => <AppIcon key={index} name="star" size={15} filled={index < Math.round(averageRating)} />)}</span></div>
            <p>{allReviews.length ? `Based on ${allReviews.length} customer ${allReviews.length === 1 ? "review" : "reviews"}` : "No customer reviews yet"}</p>
          </div>
          <ReviewList reviews={allReviews} />
        </section>
      )}
    </section>
  );
}
