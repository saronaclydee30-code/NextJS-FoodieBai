import { useState } from "react";
import AppIcon from "../../components/shared/AppIcon";
import FoodMenuGrid from "../../components/food/FoodMenuGrid";
import FoodItemImage from "../../components/food/FoodItemImage";
import Link from "next/link";
import { getPromoDiscount, promoDeals } from "../../lib/promo-deals";

export default function CartPageView({
  cartItems,
  deliverySettings,
  suggestions,
  favoriteIds,
  onChangeQuantity,
  onPlaceOrder,
  onOpenMenu,
  onAddToCart,
  onToggleFavorite,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoFeedback, setPromoFeedback] = useState("");
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const promoEligible =
    promoApplied && subtotal >= promoApplied.minimumSubtotal;
  const discount = getPromoDiscount(
    promoEligible ? promoApplied : null,
    subtotal,
  );
  const promoMessage =
    promoApplied && !promoEligible
      ? `${promoApplied.code} requires a minimum order of ₱${promoApplied.minimumSubtotal}.`
      : promoFeedback || "Enter a code from the home page deal carousel.";
  const total = subtotal ? subtotal + 49 - discount : 0;
  const hasMultipleRestaurants =
    new Set(cartItems.map((item) => item.restaurant)).size > 1;

  const applyPromo = () => {
    const selectedPromo = promoDeals.find(
      (promo) => promo.code === promoInput.trim().toUpperCase(),
    );
    if (!selectedPromo) {
      setPromoApplied(null);
      setPromoFeedback("Code not recognized. Check the home page deal carousel.");
      return;
    }

    if (subtotal < selectedPromo.minimumSubtotal) {
      setPromoApplied(null);
      setPromoFeedback(
        `${selectedPromo.code} requires a minimum order of ₱${selectedPromo.minimumSubtotal}.`,
      );
      return;
    }

    setPromoApplied(selectedPromo);
    setPromoFeedback(
      `${selectedPromo.code} applied: ${selectedPromo.description}`,
    );
  };

  const placeOrder = () => {
    onPlaceOrder({
      paymentMethod,
      promoCode: promoEligible ? promoApplied.code : "",
      discountAmount: discount,
    });
  };

  return (
    <section className="subpage-view cart-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">READY WHEN YOU ARE</span>
          <h1>Your Order Cart</h1>
          <p>
            {cartItems.length
              ? "Review your picks before checkout"
              : "Explore the menu and add something delicious!"}
          </p>
        </div>
        {cartItems.length > 0 && (
          <span className="subpage-sticker">
            <AppIcon name="cart" size={18} />{" "}
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </div>

      {!cartItems.length ? (
        <>
          <div className="empty-panel cart-empty-panel">
            <span className="empty-panel-icon">
              <AppIcon name="cart" size={28} />
            </span>
            <h2>Your cart is empty.</h2>
            <p>Explore the menu and add something delicious!</p>
            <button
              className="primary-button"
              type="button"
              onClick={onOpenMenu}
            >
              Explore menu <AppIcon name="arrowRight" size={18} />
            </button>
          </div>
          <section className="cart-discovery">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">A LITTLE INSPIRATION</span>
                <h2>Popular picks to get you started</h2>
              </div>
            </div>
            <FoodMenuGrid
              items={suggestions}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
            />
          </section>
        </>
      ) : (
        <>
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div
                    className={`cart-art food-art-${item.tone}`}
                    aria-hidden="true"
                  >
                    <FoodItemImage
                      item={item}
                      fallbackClassName="food-emoji"
                      sizes="82px"
                    />
                  </div>
                  <div className="cart-item-copy">
                    <span>{item.restaurant}</span>
                    <h3>{item.title}</h3>
                    <p>₱{item.price} each</p>
                  </div>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.title}`}
                    >
                      <AppIcon name="minus" size={15} />
                    </button>
                    <strong>{item.quantity}</strong>
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(item.id, 1)}
                      aria-label={`Increase ${item.title}`}
                    >
                      <AppIcon name="plus" size={15} />
                    </button>
                  </div>
                  <strong className="cart-item-total">
                    ₱{item.price * item.quantity}
                  </strong>
                </article>
              ))}
            </div>
            <aside className="summary-card">
              <div className="summary-title">
                <span>Order summary</span>
                <AppIcon name="sparkles" size={18} />
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₱{subtotal}</strong>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <strong>₱49</strong>
              </div>
              <div className="summary-delivery">
                <span>
                  <AppIcon name="pin" size={15} /> Deliver to
                </span>
                <strong>{deliverySettings.deliveryAddress}</strong>
                {deliverySettings.phoneNumber && (
                  <small>Contact: {deliverySettings.phoneNumber}</small>
                )}
                <Link href="/settings">
                  Edit delivery settings{" "}
                  <AppIcon name="chevronRight" size={14} />
                </Link>
                {deliverySettings.contactlessDelivery && (
                  <small>Contactless delivery requested</small>
                )}
              </div>
              <div className="promo-control">
                <label htmlFor="promo-code">Promo code</label>
                <div className="promo-input-row">
                  <input
                    id="promo-code"
                    autoCapitalize="characters"
                    maxLength={24}
                    onChange={(event) => {
                      setPromoInput(event.target.value);
                      setPromoApplied(null);
                      setPromoFeedback("");
                    }}
                    placeholder="Enter a deal code"
                    value={promoInput}
                  />
                  <button type="button" onClick={applyPromo}>
                    Apply
                  </button>
                </div>
                <small
                  className={
                    promoEligible
                      ? "promo-feedback promo-success"
                      : "promo-feedback"
                  }
                  role="status"
                >
                  {promoMessage}
                </small>
              </div>
              <fieldset className="payment-methods">
                <legend>Payment method</legend>
                {[
                  ["Cash on Delivery", "Pay when your order arrives"],
                  ["GCash", "E-wallet selection only"],
                  ["Maya", "E-wallet selection only"],
                ].map(([method, description]) => (
                  <label className="payment-option" key={method}>
                    <input
                      checked={paymentMethod === method}
                      name="payment-method"
                      onChange={() => setPaymentMethod(method)}
                      type="radio"
                      value={method}
                    />
                    <span>
                      <strong>{method}</strong>
                      <small>{description}</small>
                    </span>
                  </label>
                ))}
                <small className="checkout-demo-note">
                  Demo only. No payment is collected.
                </small>
              </fieldset>
              {hasMultipleRestaurants && (
                <p className="cart-restriction" role="alert">
                  This demo supports one restaurant per order. Remove items from
                  other restaurants to continue.
                </p>
              )}
              <div className="summary-divider" />
              {discount > 0 && (
                <div className="summary-row summary-discount">
                  <span>Promo discount</span>
                  <strong>-₱{discount}</strong>
                </div>
              )}
              <div className="summary-row summary-total">
                <span>Total</span>
                <strong>₱{total}</strong>
              </div>
              <div className="checkout-eta">
                <AppIcon name="clock" size={17} />
                <span>
                  <strong>35-50 min</strong>
                  <small>Illustrative delivery estimate</small>
                </span>
              </div>
              <button
                className="primary-button checkout-button"
                disabled={hasMultipleRestaurants}
                type="button"
                onClick={placeOrder}
              >
                Place Order <AppIcon name="arrowRight" size={18} />
              </button>
              <p className="summary-note">
                <AppIcon name="lock" size={13} /> Demo checkout only; no order
                is sent to a restaurant.
              </p>
            </aside>
          </div>
          <section className="cart-discovery">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">COMPLETE THE FEAST</span>
                <h2>Popular picks you might like</h2>
              </div>
            </div>
            <FoodMenuGrid
              items={suggestions}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
            />
          </section>
        </>
      )}
    </section>
  );
}
