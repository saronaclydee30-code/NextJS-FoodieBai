"use client";

import { useState } from "react";
import AppIcon from "../../components/shared/AppIcon";

const orderSteps = ["Confirmed", "Preparing", "On the way"];
const cancellationReasons = [
  "Ordered by mistake",
  "Taking too long",
  "Changed my mind",
  "Wrong delivery address",
  "Placed a duplicate order",
  "Other reason",
];

function getActiveOrderStep(status) {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes("deliver")) return 2;
  if (
    normalizedStatus.includes("prepar") ||
    normalizedStatus.includes("confirm")
  )
    return 1;
  return 0;
}

function OrderProgress({ status }) {
  const activeStep = getActiveOrderStep(status);

  return (
    <ol className="order-progress" aria-label={`Order progress: ${status}`}>
      {orderSteps.map((step, index) => (
        <li
          className={index <= activeStep ? "order-progress-active" : ""}
          key={step}
        >
          <span className="order-progress-marker">
            {index < activeStep ? (
              <AppIcon name="check" size={12} />
            ) : (
              index + 1
            )}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function CancelOrderDialog({ order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const cancellationReason =
    selectedReason === "Other reason" ? otherReason.trim() : selectedReason;

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="order-cancel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-order-title"
        aria-describedby="cancel-order-description"
      >
        <button
          className="order-cancel-close"
          type="button"
          aria-label="Close cancellation dialog"
          onClick={onClose}
        >
          <AppIcon name="close" size={18} />
        </button>
        <span className="section-eyebrow">ORDER {order.orderId}</span>
        <h2 id="cancel-order-title">Why are you canceling?</h2>
        <p id="cancel-order-description">
          Please choose a reason for canceling your order.
        </p>
        <div className="order-cancel-reasons">
          {cancellationReasons.map((reason) => (
            <button
              className={`order-cancel-reason${selectedReason === reason ? " order-cancel-reason-selected" : ""}`}
              type="button"
              key={reason}
              aria-pressed={selectedReason === reason}
              onClick={() => setSelectedReason(reason)}
            >
              {reason}
            </button>
          ))}
        </div>
        {selectedReason === "Other reason" && (
          <label className="order-cancel-other">
            Tell us more
            <textarea
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              placeholder="Enter your reason"
              rows={3}
              autoFocus
            />
          </label>
        )}
        <div className="order-cancel-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
          >
            Keep order
          </button>
          <button
            className="order-cancel-confirm"
            type="button"
            disabled={!cancellationReason}
            onClick={() => onConfirm(cancellationReason)}
          >
            Cancel order
          </button>
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
}) {
  const [orderToCancel, setOrderToCancel] = useState(null);

  return (
    <section className="subpage-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">YOUR FOOD JOURNEY</span>
          <h1>Your Orders</h1>
          <p>Track active and past meal orders</p>
        </div>
        <span className="subpage-sticker">
          <AppIcon name="package" size={18} /> {orders.length}
        </span>
      </div>
      {!orders.length ? (
        <div className="empty-panel">
          <span className="empty-panel-icon">
            <AppIcon name="package" size={28} />
          </span>
          <h2>No order history yet.</h2>
          <p>Place an order from your cart and it will show up here.</p>
          <button className="primary-button" type="button" onClick={onOpenMenu}>
            Start an order <AppIcon name="arrowRight" size={18} />
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isCanceled = order.status.toLowerCase().includes("cancel");
            return (
              <article className="order-card" key={order.orderId}>
                {!isCanceled && <OrderProgress status={order.status} />}
                {!isCanceled && (
                  <p className="order-demo-note">
                    Demo tracking preview. Statuses do not update live.
                  </p>
                )}
                <div className="order-topline">
                  <div>
                    <span className="order-kicker">ORDER REFERENCE</span>
                    <h2>{order.orderId}</h2>
                  </div>
                  <span
                    className={`status-badge${isCanceled ? " status-badge-canceled" : ""}`}
                  >
                    <span /> {order.status}
                  </span>
                </div>
                <div className="order-time">
                  <AppIcon name="clock" size={15} /> {order.orderTime}
                </div>
                <p className="order-items">
                  {order.items
                    .map((item) => `${item.quantity}x ${item.title}`)
                    .join(", ")}
                </p>
                <div className="order-delivery-details">
                  <span>
                    <AppIcon name="pin" size={15} />{" "}
                    {order.deliveryAddress || "123 Foodie Street, Metro Manila"}
                  </span>
                  {order.phoneNumber && (
                    <span>
                      <AppIcon name="user" size={15} /> {order.phoneNumber}
                    </span>
                  )}
                  {order.paymentMethod && (
                    <span>Payment choice: {order.paymentMethod} (demo)</span>
                  )}
                  {order.estimatedDelivery && (
                    <span>
                      Illustrative estimate: {order.estimatedDelivery}
                    </span>
                  )}
                  {order.promoCode && (
                    <span>
                      Promo {order.promoCode}: -₱{order.discountAmount}
                    </span>
                  )}
                  {order.contactlessDelivery && (
                    <span>
                      <AppIcon name="check" size={15} /> Contactless delivery
                    </span>
                  )}
                  {order.deliveryInstructions && (
                    <span className="order-delivery-instructions">
                      Rider note: {order.deliveryInstructions}
                    </span>
                  )}
                </div>
                {isCanceled && order.cancelReason && (
                  <p className="order-canceled-reason">
                    <strong>Cancellation reason:</strong> {order.cancelReason}
                  </p>
                )}
                <div className="order-bottomline">
                  <span>Order total</span>
                  <strong>₱{order.totalPrice}</strong>
                </div>
                {(isCanceled || canCancelOrder(order)) && (
                  <div className="order-cancel-link">
                    {isCanceled ? (
                      <button
                        type="button"
                        aria-label={`Remove order ${order.orderId} from order history`}
                        onClick={() => onRemoveOrder(order.orderId)}
                      >
                        Remove order
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOrderToCancel(order)}
                      >
                        Cancel order
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
          <div className="orders-next-step">
            <span className="orders-next-icon">
              <AppIcon name="utensils" size={20} />
            </span>
            <div>
              <strong>Found another favorite?</strong>
              <p>Browse the menu and make your next meal a good one.</p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={onOpenMenu}
            >
              Explore menu <AppIcon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      )}
      {orderToCancel && (
        <CancelOrderDialog
          order={orderToCancel}
          onClose={() => setOrderToCancel(null)}
          onConfirm={(reason) => {
            if (onCancelOrder(orderToCancel.orderId, reason)) {
              setOrderToCancel(null);
            }
          }}
        />
      )}
    </section>
  );
}
