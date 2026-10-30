import AppIcon from "../../components/shared/AppIcon";
import { formatItemOptions, formatPHP } from "../../lib/format";

export default function CartOrderSuccessModal({ order, onTrack, onContinue }) {
  if (!order) return null;
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <div className="success-icon"><AppIcon name="check" size={31} stroke={2.2} /></div>
        <span className="section-eyebrow">ORDER PLACED</span>
        <h2 id="success-title">Order confirmed!</h2>
        <p>Your order has been added to your order history.</p>
        <div className="success-summary"><span>{order.orderId}</span><strong>{formatPHP(order.totalPrice)}</strong></div>
        <div className="success-details">
          <span className="success-detail-count">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          <span className="success-detail-label">From</span>
          <strong>{order.restaurant}</strong>
          <span className="success-detail-label">Delivering to</span>
          <strong>{order.deliveryAddress}</strong>
          {order.phoneNumber && <strong>Contact: {order.phoneNumber}</strong>}
          <span className="success-detail-label">Payment method</span>
          <strong>{order.paymentMethod}</strong>
          {order.promoCode && <strong>{order.promoCode}: -{formatPHP(order.discountAmount)}</strong>}
          <span className="success-detail-label">Estimated delivery</span>
          <strong>{order.estimatedDelivery}</strong>
          <small className="success-options-preview">{order.items.map((item) => formatItemOptions(item.options)).filter(Boolean).slice(0, 2).join(" · ")}</small>
        </div>
        <div className="success-actions"><button className="primary-button" type="button" onClick={onTrack}>Track order <AppIcon name="arrowRight" size={18} /></button><button className="secondary-button" type="button" onClick={onContinue}>Continue shopping</button></div>
      </div>
    </div>
  );
}
