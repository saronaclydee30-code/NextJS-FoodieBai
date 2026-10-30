"use client";

import { useState } from "react";
import AppIcon from "../../components/shared/AppIcon";
import ReviewForm from "../../components/orders/ReviewForm";
import { formatItemOptions, formatPHP } from "../../lib/format";
import { getOrderStatusIndex, ORDER_STATUSES } from "../../lib/order-utils";

const cancellationReasons = [
  "Ordered by mistake",
  "Taking too long",
  "Changed my mind",
  "Wrong delivery address",
  "Placed a duplicate order",
  "Other reason",
];

function getActiveOrderStep(order) {
  return Math.max(0, Math.min(ORDER_STATUSES.length - 1, order.statusIndex ?? getOrderStatusIndex(order.status)));
}

function OrderProgress({ order }) {
  const activeStep = getActiveOrderStep(order);
  return (
    <ol className="order-progress" aria-label={`Order progress: ${order.status}`}>
      {ORDER_STATUSES.map((step, index) => (
        <li className={index <= activeStep ? "order-progress-active" : ""} key={step}>
          <span className="order-progress-marker">{index < activeStep ? <AppIcon name="check" size={12} /> : index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function CancelOrderDialog({ order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const cancellationReason = selectedReason === "Other reason" ? otherReason.trim() : selectedReason;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="order-cancel-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
        <button className="order-cancel-close" type="button" aria-label="Close cancellation dialog" onClick={onClose}><AppIcon name="close" size={18} /></button>
        <span className="section-eyebrow">ORDER {order.orderId}</span>
        <h2 id="cancel-order-title">Why are you canceling?</h2>
        <p>Please choose a reason for canceling your order.</p>
        <div className="order-cancel-reasons">
          {cancellationReasons.map((reason) => (
            <button className={`order-cancel-reason${selectedReason === reason ? " order-cancel-reason-selected" : ""}`} type="button" key={reason} aria-pressed={selectedReason === reason} onClick={() => setSelectedReason(reason)}>{reason}</button>
          ))}
        </div>
        {selectedReason === "Other reason" && <label className="order-cancel-other">Tell us more<textarea value={otherReason} onChange={(event) => setOtherReason(event.target.value)} placeholder="Enter your reason" rows={3} autoFocus /></label>}
        <div className="order-cancel-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Keep order</button>
          <button className="order-cancel-confirm" type="button" disabled={!cancellationReason} onClick={() => onConfirm(cancellationReason)}>Cancel order</button>
        </div>
      </div>
    </div>
  );
}

function BuyAgainDialog({ order, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="order-cancel-modal buy-again-dialog" role="dialog" aria-modal="true" aria-labelledby="buy-again-title">
        <button className="order-cancel-close" type="button" aria-label="Close buy again dialog" onClick={onClose}><AppIcon name="close" size={18} /></button>
        <span className="section-eyebrow">YOUR CART HAS A DIFFERENT RESTAURANT</span>
        <h2 id="buy-again-title">Replace your current cart?</h2>
        <p>Your previous order from {order.restaurant} will replace the items currently in your cart. Only one restaurant can be ordered from at a time.</p>
        <div className="order-cancel-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Keep current cart</button>
          <button className="primary-button" type="button" onClick={onConfirm}>Replace and view cart</button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPageView({
  orders,
  canCancelOrder,
  onCancelOrder,
  onRemoveOrder,
  onOpenMenu,
  onOpenTracking,
  onBuyAgain,
  pendingBuyAgain,
  onCloseBuyAgain,
  onConfirmBuyAgain,
  onSubmitReview,
}) {
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToReview, setOrderToReview] = useState(null);

  return (
    <section className="subpage-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">YOUR FOOD JOURNEY</span>
          <h1>Your Orders</h1>
          <p>Track active and past meal orders</p>
        </div>
        <span className="subpage-sticker"><AppIcon name="package" size={18} /> {orders.length}</span>
      </div>
      {!orders.length ? (
        <div className="empty-panel">
          <span className="empty-panel-icon"><AppIcon name="package" size={28} /></span>
          <h2>No order history yet.</h2>
          <p>Place an order from your cart and it will show up here.</p>
          <button className="primary-button" type="button" onClick={onOpenMenu}>Start an order <AppIcon name="arrowRight" size={18} /></button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isCanceled = String(order.status || "").toLowerCase().includes("cancel");
            const isDelivered = order.status === "Delivered";
            return (
              <article className="order-card" key={order.orderId}>
                {!isCanceled && <OrderProgress order={order} />}
                <div className="order-topline">
                  <div>
                    <span className="order-kicker">{order.restaurant || "FOODIEBAI ORDER"}</span>
                    <h2>{order.orderId}</h2>
                  </div>
                  <div className="order-status-stack">
                    <span className={`status-badge${isCanceled ? " status-badge-canceled" : ""}`}><span /> {order.status}</span>
                    {order.reviewed && <span className="order-rated-badge"><AppIcon name="star" size={11} /> Rated</span>}
                  </div>
                </div>
                <div className="order-time"><AppIcon name="clock" size={15} /> {order.orderTime}</div>
                <div className="order-items order-item-lines">
                  {order.items.map((item) => (
                    <div key={item.lineId || item.id}><span><strong>{item.quantity}×</strong> {item.title}</span>{formatItemOptions(item.options) && <small>{formatItemOptions(item.options)}</small>}</div>
                  ))}
                </div>
                <div className="order-delivery-details">
                  <span><AppIcon name="pin" size={15} /> {order.deliveryAddress || "123 Foodie Street, Metro Manila"}</span>
                  {order.phoneNumber && <span><AppIcon name="user" size={15} /> {order.phoneNumber}</span>}
                  {order.paymentMethod && <span>Payment choice: {order.paymentMethod}</span>}
                  {order.estimatedDelivery && <span>Estimated delivery: {order.estimatedDelivery}</span>}
                  {order.promoCode && <span>Promo {order.promoCode}: -{formatPHP(order.discountAmount)}</span>}
                  {order.contactlessDelivery && <span><AppIcon name="check" size={15} /> Contactless delivery</span>}
                  {order.deliveryInstructions && <span className="order-delivery-instructions">Rider note: {order.deliveryInstructions}</span>}
                </div>
                {isCanceled && order.cancelReason && <p className="order-canceled-reason"><strong>Cancellation reason:</strong> {order.cancelReason}</p>}
                <details className="order-receipt">
                  <summary>View receipt and details</summary>
                  <div className="order-receipt-content">
                    <span>Subtotal <strong>{formatPHP(order.subtotal ?? order.totalPrice - order.deliveryFee + order.discountAmount)}</strong></span>
                    <span>Delivery fee <strong>{formatPHP(order.deliveryFee)}</strong></span>
                    {order.discountAmount > 0 && <span>Promo discount <strong>-{formatPHP(order.discountAmount)}</strong></span>}
                    <span className="order-receipt-total">Total <strong>{formatPHP(order.totalPrice)}</strong></span>
                  </div>
                </details>
                <div className="order-bottomline"><span>Order total</span><strong>{formatPHP(order.totalPrice)}</strong></div>
                <div className="order-actions">
                  {!isCanceled && <button className="secondary-button order-action-button" type="button" onClick={() => onOpenTracking(order.orderId)}>{isDelivered ? "View order details" : "Track order"} <AppIcon name="arrowRight" size={15} /></button>}
                  <button className="secondary-button order-action-button" type="button" onClick={() => onBuyAgain(order)}>Buy again <AppIcon name="cart" size={15} /></button>
                  {isDelivered && !order.reviewed && <button className="secondary-button order-action-button" type="button" onClick={() => setOrderToReview(order.orderId)}><AppIcon name="star" size={14} /> Rate order</button>}
                  {isCanceled ? <button className="order-remove-button" type="button" onClick={() => onRemoveOrder(order.orderId)}>Remove from history</button> : canCancelOrder(order) ? <button className="order-cancel-link-button" type="button" onClick={() => setOrderToCancel(order)}>Cancel order</button> : null}
                </div>
                {orderToReview === order.orderId && isDelivered && !order.reviewed && <ReviewForm compact onSubmit={(details) => { onSubmitReview(order.orderId, details); setOrderToReview(null); }} />}
              </article>
            );
          })}
          <div className="orders-next-step"><span className="orders-next-icon"><AppIcon name="utensils" size={20} /></span><div><strong>Found another favorite?</strong><p>Browse the menu and make your next meal a good one.</p></div><button className="secondary-button" type="button" onClick={onOpenMenu}>Explore menu <AppIcon name="arrowRight" size={16} /></button></div>
        </div>
      )}
      {orderToCancel && <CancelOrderDialog order={orderToCancel} onClose={() => setOrderToCancel(null)} onConfirm={(reason) => { if (onCancelOrder(orderToCancel.orderId, reason)) setOrderToCancel(null); }} />}
      {pendingBuyAgain && <BuyAgainDialog order={pendingBuyAgain} onClose={onCloseBuyAgain} onConfirm={onConfirmBuyAgain} />}
    </section>
  );
}
