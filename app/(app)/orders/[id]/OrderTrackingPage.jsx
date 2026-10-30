"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppIcon from "../../../components/shared/AppIcon";
import ReviewForm from "../../../components/orders/ReviewForm";
import { useFoodie } from "../../../providers";
import { getRestaurantById } from "../../../lib/food-data";
import { formatItemOptions, formatPHP } from "../../../lib/format";
import { formatCountdown, ORDER_STATUSES } from "../../../lib/order-utils";

const riderPositions = [
  { left: "14%", top: "73%" },
  { left: "32%", top: "58%" },
  { left: "51%", top: "45%" },
  { left: "70%", top: "33%" },
  { left: "84%", top: "22%" },
];

function TrackingMap({ statusIndex }) {
  const position = riderPositions[Math.max(0, Math.min(riderPositions.length - 1, statusIndex))];
  return (
    <div className="tracking-map" aria-label="Delivery map">
      <svg viewBox="0 0 800 360" role="img" aria-label="A route from the restaurant to your delivery address">
        <path className="map-road map-road-main" d="M40 300 C150 235 210 280 305 215 S440 75 560 143 S675 230 760 58" />
        <path className="map-road" d="M85 57 L215 155 L310 28 M420 330 L484 222 L690 300" />
        <path className="map-road" d="M22 125 L160 185 L230 356 M575 16 L592 142 L770 194" />
      </svg>
      <span className="map-marker map-marker-restaurant">
        <span className="map-marker-label">RESTAURANT</span>
        <span className="map-marker-dot" />
      </span>
      <span className="map-marker map-marker-rider" style={position}>
        <span className="map-marker-label">RIDER</span>
        <span className="map-marker-dot" />
      </span>
      <span className="map-marker map-marker-destination">
        <span className="map-marker-label">YOU</span>
        <span className="map-marker-dot" />
      </span>
    </div>
  );
}

export default function OrderTrackingPage({ orderId }) {
  const { orders, showToast, submitReview } = useFoodie();
  const [now, setNow] = useState(0);
  const order = orders.find((currentOrder) => currentOrder.orderId === orderId);
  const restaurant = order ? getRestaurantById(order.restaurantId) : null;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const statusIndex = Math.max(0, Math.min(ORDER_STATUSES.length - 1, order?.statusIndex ?? 0));
  const currentTime = now || Number(order?.createdAt) || 0;
  const remaining = order?.status === "Delivered" ? 0 : Math.max(0, Number(order?.estimatedArrivalAt || currentTime) - currentTime);
  const countdown = formatCountdown(remaining);
  const isCancelled = String(order?.status || "").toLowerCase().includes("cancel");
  const lineCount = useMemo(() => order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0, [order]);

  if (!order || isCancelled) {
    return (
      <section className="subpage-view tracking-not-found">
        <div className="empty-panel">
          <span className="empty-panel-icon"><AppIcon name="package" size={28} /></span>
          <h2>{isCancelled ? "This order was cancelled." : "Order not found"}</h2>
          <p>Open an order from your history to see its details.</p>
          <Link className="primary-button" href="/orders">View order history <AppIcon name="arrowRight" size={17} /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="subpage-view tracking-view">
      <Link className="tracking-back-link" href="/orders"><AppIcon name="back" size={16} /> Back to orders</Link>
      <div className="tracking-heading">
        <div>
          <span className="section-eyebrow">ORDER {order.orderId}</span>
          <h1>{order.status === "Delivered" ? "Your order has arrived" : "Track your order"}</h1>
          <p>{restaurant?.name || order.restaurant} · {lineCount} {lineCount === 1 ? "item" : "items"}</p>
        </div>
        <span className={`status-badge${order.status === "Delivered" ? " tracking-delivered" : ""}`}><span /> {order.status}</span>
      </div>

      <div className="tracking-layout">
        <div className="tracking-main-column">
          <section className="tracking-card tracking-progress-card">
            <div className="tracking-card-heading">
              <div><span className="section-eyebrow">DELIVERY PROGRESS</span><h2>{order.status === "Delivered" ? "Delivered safely" : `Arriving in ${countdown}`}</h2></div>
              <AppIcon name="delivery" size={26} />
            </div>
            <ol className="tracking-timeline" aria-label={`Delivery status: ${order.status}`}>
              {ORDER_STATUSES.map((status, index) => (
                <li className={`${index < statusIndex ? "complete" : ""}${index === statusIndex ? " current" : ""}`} key={status}>
                  <span className="tracking-timeline-marker">{index < statusIndex ? <AppIcon name="check" size={13} /> : index + 1}</span>
                  <div><strong>{status}</strong><small>{index === statusIndex ? "Current status" : index < statusIndex ? "Completed" : "Coming up"}</small></div>
                </li>
              ))}
            </ol>
          </section>

          {order.status !== "Delivered" && <TrackingMap statusIndex={statusIndex} />}

          {order.status === "Delivered" && !order.reviewed ? (
            <ReviewForm onSubmit={(details) => submitReview(order.orderId, details)} />
          ) : order.reviewed ? (
            <div className="tracking-rated-note"><AppIcon name="star" size={18} /> You already rated this order. Thank you!</div>
          ) : null}

          <section className="tracking-card tracking-items-card">
            <div className="tracking-card-heading"><div><span className="section-eyebrow">ORDER DETAILS</span><h2>Your items</h2></div><Link href={`/restaurants/${order.restaurantId}`}>View restaurant <AppIcon name="chevronRight" size={14} /></Link></div>
            <div className="tracking-item-list">
              {order.items.map((item) => (
                <div className="tracking-item-row" key={item.lineId || item.id}>
                  <span><strong>{item.quantity}×</strong> {item.title}{formatItemOptions(item.options) && <small>{formatItemOptions(item.options)}</small>}</span>
                  <strong>{formatPHP(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="tracking-receipt-rows">
              <span>Subtotal <strong>{formatPHP(order.subtotal ?? order.totalPrice - order.deliveryFee + order.discountAmount)}</strong></span>
              <span>Delivery fee <strong>{formatPHP(order.deliveryFee)}</strong></span>
              {order.discountAmount > 0 && <span>Promo discount <strong>-{formatPHP(order.discountAmount)}</strong></span>}
              <span className="tracking-total">Total <strong>{formatPHP(order.totalPrice)}</strong></span>
            </div>
          </section>
        </div>

        <aside className="tracking-side-column">
          <section className="tracking-card rider-card">
            <div className="rider-avatar">{order.rider?.name?.slice(0, 1) || "P"}</div>
            <div className="rider-copy"><span className="section-eyebrow">YOUR RIDER</span><h2>{order.rider?.name || "Paolo Santos"}</h2><p><AppIcon name="star" size={13} /> {order.rider?.rating || "4.9"} · FoodieBai delivery partner</p></div>
            <div className="rider-actions"><button type="button" onClick={() => showToast("Call started.")}><AppIcon name="phone" size={17} /> Call</button><button type="button" onClick={() => showToast("Chat opened.")}><AppIcon name="message" size={17} /> Chat</button></div>
          </section>
          <section className="tracking-card tracking-address-card"><span className="tracking-address-icon"><AppIcon name="pin" size={20} /></span><div><span className="section-eyebrow">DELIVERING TO</span><strong>{order.deliveryAddress}</strong>{order.phoneNumber && <small>{order.phoneNumber}</small>}{order.contactlessDelivery && <small>Contactless delivery</small>}</div></section>
          <section className="tracking-card tracking-payment-card"><span className="section-eyebrow">PAYMENT</span><strong>{order.paymentMethod}</strong><small>Payment method selected at checkout.</small></section>
        </aside>
      </div>
    </section>
  );
}
