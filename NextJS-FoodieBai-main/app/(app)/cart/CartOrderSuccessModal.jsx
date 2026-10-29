import AppIcon from "../../components/shared/AppIcon";

export default function CartOrderSuccessModal({ order, onTrack, onContinue }) {
  if (!order) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <div className="success-icon"><AppIcon name="check" size={31} stroke={2.2} /></div>
        <span className="section-eyebrow">ORDER CONFIRMED</span>
        <h2 id="success-title">Your order is on its way!</h2>
        <p>Thanks for choosing FoodieBai. The kitchen is already getting started.</p>
        <div className="success-summary"><span>{order.orderId}</span><strong>₱{order.totalPrice}</strong></div>
        <div className="success-actions">
          <button className="primary-button" type="button" onClick={onTrack}>Track order <AppIcon name="arrowRight" size={18} /></button>
          <button className="secondary-button" type="button" onClick={onContinue}>Continue shopping</button>
        </div>
      </div>
    </div>
  );
}

