"use client";

import Image from "next/image";
import { useState } from "react";
import AppIcon from "../../components/shared/AppIcon";
import { useFoodie } from "../../providers";

export default function SettingsPage() {
  const {
    deliverySettings,
    fontScale,
    setFontScale,
    darkMode,
    setDarkMode,
    hydrated,
    updateDeliverySettings,
    showToast,
    resetDemoData,
  } = useFoodie();
  const [draft, setDraft] = useState(null);
  const settingsDraft = draft || deliverySettings;

  const updateField = (field, value) => {
    setDraft((current) => ({
      ...(current || deliverySettings),
      [field]: value,
    }));
  };

  const saveSettings = (event) => {
    event.preventDefault();
    if (!settingsDraft.street?.trim() || !settingsDraft.barangay?.trim() || !settingsDraft.city?.trim()) {
      showToast("Complete your street, barangay, and city before saving");
      return;
    }

    updateDeliverySettings(settingsDraft);
    showToast("Delivery settings saved");
  };

  const handleResetDemoData = () => {
    const confirmed = window.confirm(
      "Reset all FoodieBai demo data on this device? This will sign you out and remove your saved cart, orders, reviews, favorites, and preferences.",
    );

    if (!confirmed) return;

    setDraft(null);
    resetDemoData();
  };

  return (
    <section className="subpage-view settings-view">
      <div className="subpage-heading">
        <div>
          <span className="section-eyebrow">MAKE IT YOURS</span>
          <h1>Settings</h1>
          <p>Set up your delivery details for an easier checkout.</p>
        </div>
        <span className="subpage-sticker">
          <Image
            className="icon"
            src="/settings-icon.png"
            alt=""
            width={18}
            height={18}
          />{" "}
          Preferences
        </span>
      </div>

      <form className="settings-form" onSubmit={saveSettings}>
        <section
          className="settings-card"
          aria-labelledby="delivery-settings-title"
        >
          <div className="settings-card-heading">
            <span className="settings-card-icon">
              <AppIcon name="pin" size={20} />
            </span>
            <div>
              <h2 id="delivery-settings-title">Delivery details</h2>
              <p>These details will be saved with every order.</p>
            </div>
          </div>

          <div className="settings-address-grid">
            <label className="settings-field">
              <span>House / unit no.</span>
              <input autoComplete="address-line1" maxLength={40} onChange={(event) => updateField("houseNumber", event.target.value)} placeholder="123" value={settingsDraft.houseNumber || ""} disabled={!hydrated} />
            </label>
            <label className="settings-field settings-address-wide">
              <span>Street</span>
              <input autoComplete="street-address" maxLength={100} onChange={(event) => updateField("street", event.target.value)} placeholder="Foodie Street" required value={settingsDraft.street || ""} disabled={!hydrated} />
            </label>
            <label className="settings-field">
              <span>Barangay</span>
              <input autoComplete="address-level3" maxLength={80} onChange={(event) => updateField("barangay", event.target.value)} placeholder="Poblacion" required value={settingsDraft.barangay || ""} disabled={!hydrated} />
            </label>
            <label className="settings-field settings-address-wide">
              <span>City / province</span>
              <input autoComplete="address-level2" maxLength={100} onChange={(event) => updateField("city", event.target.value)} placeholder="Makati, Metro Manila" required value={settingsDraft.city || ""} disabled={!hydrated} />
            </label>
          </div>
          <div className="settings-address-preview"><AppIcon name="pin" size={15} /><span><small>Saved delivery address</small><strong>{[settingsDraft.houseNumber, settingsDraft.street, settingsDraft.barangay && `Brgy. ${settingsDraft.barangay.replace(/^brgy\.\s*/i, "")}`, settingsDraft.city].filter(Boolean).join(", ") || "Complete the fields above"}</strong></span></div>

          <label className="settings-field">
            <span>
              Phone number <small>Optional</small>
            </span>
            <input
              autoComplete="tel"
              inputMode="tel"
              maxLength={32}
              onChange={(event) =>
                updateField("phoneNumber", event.target.value)
              }
              placeholder="e.g. +63 9XX XXX XXXX"
              type="tel"
              value={settingsDraft.phoneNumber || ""}
              disabled={!hydrated}
            />
          </label>

          <label className="settings-field">
            <span>
              Instructions for your rider <small>Optional</small>
            </span>
            <textarea
              maxLength={240}
              onChange={(event) =>
                updateField("deliveryInstructions", event.target.value)
              }
              placeholder="For example: Please call when you arrive."
              rows={3}
              value={settingsDraft.deliveryInstructions}
              disabled={!hydrated}
            />
            <small className="settings-field-hint">
              {settingsDraft.deliveryInstructions.length}/240 characters
            </small>
          </label>

          <label className="settings-toggle">
            <span className="settings-toggle-icon">
              <AppIcon name="user" size={18} />
            </span>
            <span className="settings-toggle-copy">
              <strong>Contactless delivery</strong>
              <small>Ask the rider to leave your order at the door.</small>
            </span>
            <input
              checked={settingsDraft.contactlessDelivery}
              onChange={(event) =>
                updateField("contactlessDelivery", event.target.checked)
              }
              type="checkbox"
              disabled={!hydrated}
            />
            <span className="settings-switch" aria-hidden="true" />
          </label>
        </section>

        <section className="settings-card" aria-labelledby="dark-mode-title">
          <div className="settings-card-heading">
            <span className="settings-card-icon settings-dark-mode-icon">
              <AppIcon name="sparkles" size={20} />
            </span>
            <div>
              <h2 id="dark-mode-title">Dark mode</h2>
              <p>Use a darker color theme throughout the website.</p>
            </div>
          </div>
          <label className="settings-toggle">
            <span className="settings-toggle-icon settings-dark-mode-icon">
              <AppIcon name="sparkles" size={18} />
            </span>
            <span className="settings-toggle-copy">
              <strong>Dark mode</strong>
              <small>
                {darkMode ? "On — easier on the eyes in low light." : "Off"}
              </small>
            </span>
            <input
              type="checkbox"
              role="switch"
              aria-label="Dark mode"
              checked={darkMode}
              onChange={(event) => setDarkMode(event.target.checked)}
              disabled={!hydrated}
            />
            <span className="settings-switch" aria-hidden="true" />
          </label>
        </section>

        <section className="settings-card" aria-labelledby="text-size-title">
          <div className="settings-card-heading">
            <span
              className="settings-card-icon settings-text-icon"
              aria-hidden="true"
            >
              Aa
            </span>
            <div>
              <h2 id="text-size-title">Text size</h2>
              <p>Make text easier to read across the app.</p>
            </div>
          </div>
          <label className="settings-text-control" htmlFor="text-size">
            <span>Adjust text size</span>
            <output htmlFor="text-size">{Math.round(fontScale * 100)}%</output>
            <input
              id="text-size"
              type="range"
              min="100"
              max="130"
              step="5"
              value={Math.round(fontScale * 100)}
              onChange={(event) =>
                setFontScale(Number(event.target.value) / 100)
              }
              disabled={!hydrated}
            />
            <span className="settings-text-range-labels" aria-hidden="true">
              <span>Default</span>
              <span>Larger</span>
            </span>
          </label>
        </section>

        <section className="settings-card settings-reset-card" aria-labelledby="reset-demo-title">
          <div className="settings-card-heading">
            <span className="settings-card-icon settings-reset-icon">
              <AppIcon name="refresh" size={20} />
            </span>
            <div>
              <h2 id="reset-demo-title">Reset demo data</h2>
              <p>Start the presentation with a clean app state.</p>
            </div>
          </div>
          <p className="settings-reset-copy">
            This clears the saved demo account, cart, orders, reviews,
            favorites, address, and preferences from this device.
          </p>
          <button
            className="secondary-button settings-reset-button"
            type="button"
            onClick={handleResetDemoData}
            disabled={!hydrated}
          >
            Reset demo data <AppIcon name="refresh" size={17} />
          </button>
        </section>

        <div className="settings-footer">
          <p>
            <AppIcon name="lock" size={15} /> Your preferences are saved on
            this device.
          </p>
          <button className="primary-button" type="submit" disabled={!hydrated}>
            Save settings <AppIcon name="check" size={17} />
          </button>
        </div>
      </form>
    </section>
  );
}
