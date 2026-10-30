"use client";

import { useEffect, useMemo, useState } from "react";
import AppIcon from "../shared/AppIcon";
import FoodItemImage from "./FoodItemImage";
import { getFoodCustomizationConfig, getRestaurantById } from "../../lib/food-data";
import { formatPHP } from "../../lib/format";

export default function FoodCustomizationModal({ item, onClose, onConfirm }) {
  const initialConfig = item ? getFoodCustomizationConfig(item) : null;
  const [sizeId, setSizeId] = useState(initialConfig?.sizes[0]?.id || "");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);
  const [spiceLevel, setSpiceLevel] = useState(initialConfig?.spiceLevels[0] || "Not spicy");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  const config = useMemo(
    () => (item ? getFoodCustomizationConfig(item) : null),
    [item],
  );
  const restaurant = item ? getRestaurantById(item.restaurantId) : null;

  useEffect(() => {
    if (!item) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item || !config) return null;

  const selectedSize = config.sizes.find((size) => size.id === sizeId) || config.sizes[0];
  const selectedAddOns = config.addOns.filter((addOn) => selectedAddOnIds.includes(addOn.id));
  const optionsTotal = (selectedSize?.price || 0) + selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const unitTotal = item.price + optionsTotal;
  const isClosed = restaurant && !restaurant.isOpen;

  const toggleAddOn = (id) => {
    setSelectedAddOnIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const handleSubmit = () => {
    onConfirm(item, {
      size: selectedSize,
      addOns: selectedAddOns,
      spiceLevel,
      specialInstructions,
    }, quantity);
  };

  return (
    <div className="customization-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="customization-modal" role="dialog" aria-modal="true" aria-labelledby="customization-title">
        <div className="customization-heading">
          <div className={`customization-art food-art food-art-${item.tone}`}>
            <FoodItemImage item={item} fallbackClassName="food-emoji" sizes="76px" />
          </div>
          <div>
            <span className="section-eyebrow">CUSTOMIZE YOUR ORDER</span>
            <h2 id="customization-title">{item.title}</h2>
            <p>{item.restaurant} · {formatPHP(item.price)} base price</p>
          </div>
          <button className="customization-close" type="button" onClick={onClose} aria-label="Close customization dialog">
            <AppIcon name="close" size={19} />
          </button>
        </div>

        <div className="customization-scroll-area">
          <fieldset className="customization-group">
            <legend>Choose a size</legend>
            <div className="customization-choice-grid">
              {config.sizes.map((size) => (
                <label className={`customization-choice${size.id === sizeId ? " selected" : ""}`} key={size.id}>
                  <input type="radio" name="food-size" checked={size.id === sizeId} onChange={() => setSizeId(size.id)} />
                  <span>{size.label}</span>
                  <strong>{size.price ? `+${formatPHP(size.price)}` : "Included"}</strong>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="customization-group">
            <legend>Add-ons</legend>
            <div className="customization-choice-list">
              {config.addOns.map((addOn) => (
                <label className={`customization-choice${selectedAddOnIds.includes(addOn.id) ? " selected" : ""}`} key={addOn.id}>
                  <input type="checkbox" checked={selectedAddOnIds.includes(addOn.id)} onChange={() => toggleAddOn(addOn.id)} />
                  <span>{addOn.label}</span>
                  <strong>{addOn.price ? `+${formatPHP(addOn.price)}` : "Included"}</strong>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="customization-two-column">
            <label className="customization-field">
              <span>Spice level</span>
              <select value={spiceLevel} onChange={(event) => setSpiceLevel(event.target.value)}>
                {config.spiceLevels.map((level) => <option key={level}>{level}</option>)}
              </select>
            </label>
            <label className="customization-field">
              <span>Special instructions <small>Optional</small></span>
              <input maxLength={120} value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} placeholder="Less sauce, please" />
            </label>
          </div>

          {isClosed && <p className="customization-closed-note">This restaurant is currently closed. Ordering will be available when it opens.</p>}
        </div>

        <div className="customization-footer">
          <div className="quantity-control customization-quantity" aria-label="Quantity">
            <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><AppIcon name="minus" size={15} /></button>
            <strong>{quantity}</strong>
            <button type="button" onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity"><AppIcon name="plus" size={15} /></button>
          </div>
          <button className="primary-button customization-submit" type="button" onClick={handleSubmit} disabled={isClosed}>
            {isClosed ? "Restaurant closed" : `Add ${formatPHP(unitTotal * quantity)}`} <AppIcon name="cart" size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
