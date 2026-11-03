import Image from "next/image";
import Link from "next/link";
import AppIcon from "../shared/AppIcon";
import { formatPHP } from "../../lib/format";

const restaurantLogoFiles = {
  "jollibee": "8.png",
  "mcdonald-s": "11.png",
  "kfc": "9.png",
  "chowking": "4.png",
  "mang-inasal": "10.png",
  "greenwich": "7.png",
  "potato-corner": "12.png",
  "bonchon": "2.png",
  "burger-king": "3.png",
  "tokyo-tokyo": "15.png",
  "shakey-s": "13.png",
  "starbucks": "14.png",
  "coco-fresh-tea": "5.png",
  "goldilocks": "6.png",
  "army-navy": "1.png",
};

export default function RestaurantCard({ restaurant, itemCount, showLogo = false }) {
  return (
    <Link className="restaurant-card" href={`/restaurants/${restaurant.id}`}>
      <div className={`restaurant-card-cover${showLogo ? " restaurant-card-logo-cover" : ""}`}>
        <Image
          src={showLogo ? `/restaurant-logos/${restaurantLogoFiles[restaurant.id]}` : restaurant.coverImage}
          alt={showLogo ? `${restaurant.name} logo` : ""}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 900px) 42vw, 260px"
        />
        <span className={`restaurant-open-badge${restaurant.isOpen ? "" : " restaurant-closed"}`}>
          <span /> {restaurant.isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <div className="restaurant-card-copy">
        <div className="restaurant-card-heading">
          <h3>{restaurant.name}</h3>
          <span className="restaurant-rating">
            <AppIcon name="star" size={12} /> {restaurant.rating.toFixed(1)}
          </span>
        </div>
        <p>{restaurant.cuisine}</p>
        <div className="restaurant-card-meta">
          <span><AppIcon name="clock" size={13} /> {restaurant.deliveryTime}</span>
          <span>{formatPHP(restaurant.deliveryFee)} delivery</span>
          {itemCount ? <span>{itemCount} dishes</span> : null}
        </div>
      </div>
    </Link>
  );
}
