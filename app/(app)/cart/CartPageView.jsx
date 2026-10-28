import AppIcon from "../../components/shared/AppIcon";
import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import Link from "next/link";

export default function CartPageView({ cartItems, deliverySettings, suggestions, favoriteIds, onChangeQuantity, onPlaceOrder, onOpenMenu, onAddToCart, onToggleFavorite }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal ? subtotal + 49 : 0;

  return (
    <section className="subpage-view cart-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">READY WHEN YOU ARE</span>
          <h1>Your Order Cart</h1>
          <p>{cartItems.length ? "Review your picks before checkout" : "Explore the menu and add something delicious!"}</p>
        </div>
        {cartItems.length > 0 && <span className="subpage-sticker"><AppIcon name="cart" size={18} /> {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>}
      </div>

      {!cartItems.length ? (
        <>
          <div className="empty-panel cart-empty-panel">
            <span className="empty-panel-icon"><AppIcon name="cart" size={28} /></span>
            <h2>Your cart is empty.</h2>
            <p>Explore the menu and add something delicious!</p>
            <button className="primary-button" type="button" onClick={onOpenMenu}>Explore menu <AppIcon name="arrowRight" size={18} /></button>
          </div>
          <section className="cart-discovery">
            <div className="section-heading">
              <div><span className="section-eyebrow">A LITTLE INSPIRATION</span><h2>Popular picks to get you started</h2></div>
            </div>
            <FoodMenuGrid items={suggestions} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
          </section>
        </>
      ) : (
        <>
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className={`cart-art food-art-${item.tone}`} aria-hidden="true">{item.emoji}</div>
                  <div className="cart-item-copy">
                    <span>{item.restaurant}</span>
                    <h3>{item.title}</h3>
                    <p>₱{item.price} each</p>
                  </div>
                  <div className="quantity-control">
                    <button type="button" onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Decrease ${item.title}`}><AppIcon name="minus" size={15} /></button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Increase ${item.title}`}><AppIcon name="plus" size={15} /></button>
                  </div>
                  <strong className="cart-item-total">₱{item.price * item.quantity}</strong>
                </article>
              ))}
            </div>
            <aside className="summary-card">
              <div className="summary-title"><span>Order summary</span><AppIcon name="sparkles" size={18} /></div>
              <div className="summary-row"><span>Subtotal</span><strong>₱{subtotal}</strong></div>
              <div className="summary-row"><span>Delivery Fee</span><strong>₱49</strong></div>
              <div className="summary-delivery">
                <span><AppIcon name="pin" size={15} /> Deliver to</span>
                <strong>{deliverySettings.deliveryAddress}</strong>
                <Link href="/settings">Edit delivery settings <AppIcon name="chevronRight" size={14} /></Link>
                {deliverySettings.contactlessDelivery && <small>Contactless delivery requested</small>}
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total"><span>Total</span><strong>₱{total}</strong></div>
              <button className="primary-button checkout-button" type="button" onClick={onPlaceOrder}>Place Order <AppIcon name="arrowRight" size={18} /></button>
              <p className="summary-note"><AppIcon name="lock" size={13} /> Secure cash or e-wallet checkout</p>
            </aside>
          </div>
          <section className="cart-discovery">
            <div className="section-heading">
              <div><span className="section-eyebrow">COMPLETE THE FEAST</span><h2>Popular picks you might like</h2></div>
            </div>
            <FoodMenuGrid items={suggestions} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
          </section>
        </>
      )}
    </section>
  );
}
