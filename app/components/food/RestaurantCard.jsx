import Image from "next/image";
import Link from "next/link";
import AppIcon from "../shared/AppIcon";
import { formatPHP } from "../../lib/format";

export default function RestaurantCard({ restaurant, itemCount }) {
  return (
    <Link className="restaurant-card" href={`/restaurants/${restaurant.id}`}>
      <div className="restaurant-card-cover">
        <Image
          src={restaurant.coverImage}
          alt=""
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
