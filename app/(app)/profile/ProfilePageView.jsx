import AppIcon from "../../components/shared/AppIcon";
import Link from "next/link";

export default function ProfilePageView({
  user,
  orders,
  favoriteCount,
  deliveryAddress,
  phoneNumber,
  onLogout,
}) {
  const initials = (user?.username || "F").slice(0, 1).toUpperCase();

  return (
    <section className="subpage-view profile-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">YOUR FOODIE SPACE</span>
          <h1>My Profile</h1>
          <p>Keep your details ready for the next delivery</p>
        </div>
      </div>
      <div className="profile-layout">
        <div className="profile-main-card">
          <div className="profile-avatar">{initials}</div>
          <h2>{user?.username || "FoodieUser"}</h2>
          <p>{user?.email || "user@foodiebai.com"}</p>
          <div className="profile-stats">
            <div>
              <strong>{orders.length}</strong>
              <span>Orders</span>
            </div>
            <div>
              <strong>{favoriteCount}</strong>
              <span>Saved</span>
            </div>
            <div>
              <strong>Demo</strong>
              <span>Points</span>
            </div>
          </div>
        </div>
        <div className="profile-details-card">
          <div className="detail-row">
            <span>
              <AppIcon name="pin" size={17} /> Delivery Address
            </span>
            <strong>{deliveryAddress}</strong>
          </div>
          <div className="detail-row">
            <span>
              <AppIcon name="user" size={17} /> Phone Number
            </span>
            <strong>{phoneNumber || "Not set"}</strong>
          </div>
          <div className="detail-row">
            <span>
              <AppIcon name="cart" size={17} /> Payment Method
            </span>
            <strong>Demo only — no payment processed</strong>
          </div>
        </div>
      </div>
      <section
        className="profile-shortcuts"
        aria-labelledby="profile-shortcuts-title"
      >
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">YOUR NEXT STEP</span>
            <h2 id="profile-shortcuts-title">Your FoodieBai shortcuts</h2>
          </div>
          <span className="profile-shortcuts-note">
            Pick up where you left off
          </span>
        </div>
        <div className="profile-shortcut-grid">
          <Link className="profile-shortcut" href="/orders">
            <span className="profile-shortcut-icon">
              <AppIcon name="package" size={19} />
            </span>
            <span>
              <strong>Order history</strong>
              <small>
                {orders.length
                  ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} to revisit`
                  : "Your future meals will show up here"}
              </small>
            </span>
            <AppIcon name="chevronRight" size={17} />
          </Link>
          <Link className="profile-shortcut" href="/saved">
            <span className="profile-shortcut-icon shortcut-heart">
              <AppIcon name="heart" size={19} />
            </span>
            <span>
              <strong>Saved favorites</strong>
              <small>
                {favoriteCount
                  ? `${favoriteCount} dishes saved for later`
                  : "Save a dish you want to try"}
              </small>
            </span>
            <AppIcon name="chevronRight" size={17} />
          </Link>
          <Link className="profile-shortcut" href="/menu">
            <span className="profile-shortcut-icon shortcut-menu">
              <AppIcon name="sparkles" size={19} />
            </span>
            <span>
              <strong>Discover something new</strong>
              <small>Explore dishes from local favorites</small>
            </span>
            <AppIcon name="chevronRight" size={17} />
          </Link>
        </div>
      </section>
      <button className="logout-button" type="button" onClick={onLogout}>
        <AppIcon name="logout" size={18} /> Log Out
      </button>
    </section>
  );
}
