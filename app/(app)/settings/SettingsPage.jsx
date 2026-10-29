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
    if (!settingsDraft.deliveryAddress.trim()) {
      showToast("Add a delivery address before saving");
      return;
    }

    updateDeliverySettings(settingsDraft);
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

          <label className="settings-field">
            <span>Delivery address</span>
            <input
              autoComplete="street-address"
              maxLength={180}
              onChange={(event) =>
                updateField("deliveryAddress", event.target.value)
              }
              placeholder="House number, street, city"
              required
              value={settingsDraft.deliveryAddress}
              disabled={!hydrated}
            />
          </label>

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
