import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import AppIcon from "../../components/shared/AppIcon";
import Link from "next/link";

export default function SavedPageView({ items, favoriteIds, onToggleFavorite, onAddToCart }) {
  return (
    <section className="subpage-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">JUST FOR YOU</span>
          <h1>Saved Favorites</h1>
          <p>Your favorite dishes in one place</p>
        </div>
        <span className="subpage-sticker sticker-heart"><AppIcon name="heart" size={18} filled /> {items.length}</span>
      </div>
      {items.length ? (
        <>
          <div className="saved-note">
            <span className="saved-note-icon"><AppIcon name="sparkles" size={17} /></span>
            <p>Your shortlist is ready whenever a craving hits. Add a favorite directly to your cart when you find the one.</p>
            <Link href="/menu">Find more dishes <AppIcon name="chevronRight" size={15} /></Link>
          </div>
          <FoodMenuGrid items={items} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
        </>
      ) : (
        <div className="empty-panel">
          <span className="empty-panel-icon"><AppIcon name="heart" size={28} /></span>
          <h2>No saved favorites yet.</h2>
          <p>Tap the heart icon on any dish to save it!</p>
          <Link className="primary-button" href="/menu">Explore dishes <AppIcon name="arrowRight" size={18} /></Link>
        </div>
      )}
    </section>
  );
}
