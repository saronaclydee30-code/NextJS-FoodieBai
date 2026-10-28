import AppIcon from "../../components/shared/AppIcon";

const orderSteps = ["Confirmed", "Preparing", "On the way"];

function getActiveOrderStep(status) {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes("deliver")) return 2;
  if (normalizedStatus.includes("prepar") || normalizedStatus.includes("confirm")) return 1;
  return 0;
}

function OrderProgress({ status }) {
  const activeStep = getActiveOrderStep(status);

  return (
    <ol className="order-progress" aria-label={`Order progress: ${status}`}>
      {orderSteps.map((step, index) => (
        <li className={index <= activeStep ? "order-progress-active" : ""} key={step}>
          <span className="order-progress-marker">{index < activeStep ? <AppIcon name="check" size={12} /> : index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function OrdersPageView({ orders, onOpenMenu }) {
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
          {orders.map((order) => (
            <article className="order-card" key={order.orderId}>
              <OrderProgress status={order.status} />
              <div className="order-topline">
                <div>
                  <span className="order-kicker">ORDER REFERENCE</span>
                  <h2>{order.orderId}</h2>
                </div>
                <span className="status-badge"><span /> {order.status}</span>
              </div>
              <div className="order-time"><AppIcon name="clock" size={15} /> {order.orderTime}</div>
              <p className="order-items">{order.items.map((item) => `${item.quantity}x ${item.title}`).join(", ")}</p>
              <div className="order-bottomline"><span>Total Paid</span><strong>₱{order.totalPrice}</strong></div>
            </article>
          ))}
          <div className="orders-next-step">
            <span className="orders-next-icon"><AppIcon name="utensils" size={20} /></span>
            <div><strong>Found another favorite?</strong><p>Browse the menu and make your next meal a good one.</p></div>
            <button className="secondary-button" type="button" onClick={onOpenMenu}>Explore menu <AppIcon name="arrowRight" size={16} /></button>
          </div>
        </div>
      )}
    </section>
  );
}
