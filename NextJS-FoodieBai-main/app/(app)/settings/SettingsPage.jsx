"use client";

import { useState } from "react";
import AppIcon from "../../components/shared/AppIcon";
import { useFoodie } from "../../providers";

export default function SettingsPage() {
  const { deliverySettings, updateDeliverySettings, showToast } = useFoodie();
  const [draft, setDraft] = useState(deliverySettings);

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveSettings = (event) => {
    event.preventDefault();
    if (!draft.deliveryAddress.trim()) {
      showToast("Add a delivery address before saving");
      return;
    }

    updateDeliverySettings(draft);
    showToast("Delivery settings saved");
  };

  return (
    <section className="subpage-view settings-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">MAKE IT YOURS</span>
          <h1>Settings</h1>
          <p>Set up your delivery details for an easier checkout.</p>
        </div>
        <span className="subpage-sticker"><AppIcon name="settings" size={18} /> Preferences</span>
      </div>

      <form className="settings-form" onSubmit={saveSettings}>
        <section className="settings-card" aria-labelledby="delivery-settings-title">
          <div className="settings-card-heading">
            <span className="settings-card-icon"><AppIcon name="pin" size={20} /></span>
            <div>
              <h2 id="delivery-settings-title">Delivery details</h2>
              <p>These details will be saved with every order.</p>
            </div>
          </div>

          <label className="settings-field">
            <span>Delivery address</span>
            <input
              autoComplete="street-address"
              maxLength={180}
              onChange={(event) => updateField("deliveryAddress", event.target.value)}
              placeholder="House number, street, city"
              required
              value={draft.deliveryAddress}
            />
          </label>

          <label className="settings-field">
            <span>Instructions for your rider <small>Optional</small></span>
            <textarea
              maxLength={240}
              onChange={(event) => updateField("deliveryInstructions", event.target.value)}
              placeholder="For example: Please call when you arrive."
              rows={3}
              value={draft.deliveryInstructions}
            />
            <small className="settings-field-hint">{draft.deliveryInstructions.length}/240 characters</small>
          </label>

          <label className="settings-toggle">
            <span className="settings-toggle-icon"><AppIcon name="user" size={18} /></span>
            <span className="settings-toggle-copy">
              <strong>Contactless delivery</strong>
              <small>Ask the rider to leave your order at the door.</small>
            </span>
            <input
              checked={draft.contactlessDelivery}
              onChange={(event) => updateField("contactlessDelivery", event.target.checked)}
              type="checkbox"
            />
            <span className="settings-switch" aria-hidden="true" />
          </label>
        </section>

        <div className="settings-footer">
          <p><AppIcon name="lock" size={15} /> Your delivery preferences are saved on this device.</p>
          <button className="primary-button" type="submit">Save settings <AppIcon name="check" size={17} /></button>
        </div>
      </form>
    </section>
  );
}
