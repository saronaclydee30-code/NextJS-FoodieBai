const phpFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPHP(value) {
  const amount = Number(value);
  return phpFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function normalizeItemOptions(options = {}) {
  const size = options.size
    ? {
        id: String(options.size.id || options.size.label || "regular"),
        label: String(options.size.label || options.size.id || "Regular"),
        price: Number(options.size.price) || 0,
      }
    : null;

  const addOns = Array.isArray(options.addOns)
    ? options.addOns.map((addOn) => ({
        id: String(addOn.id || addOn.label || "addon"),
        label: String(addOn.label || addOn.id || "Add-on"),
        price: Number(addOn.price) || 0,
      }))
    : [];

  return {
    size,
    addOns,
    spiceLevel: String(options.spiceLevel || "Not spicy"),
    specialInstructions: String(options.specialInstructions || "").trim(),
  };
}

export function getOptionsPrice(options) {
  const normalized = normalizeItemOptions(options);
  return (
    (normalized.size?.price || 0) +
    normalized.addOns.reduce((sum, addOn) => sum + addOn.price, 0)
  );
}

export function getCartLineId(itemId, options = {}) {
  const normalized = normalizeItemOptions(options);
  const optionKey = JSON.stringify(normalized);
  return `${itemId}::${encodeURIComponent(optionKey)}`;
}

export function formatItemOptions(options) {
  const normalized = normalizeItemOptions(options);
  const parts = [];

  if (normalized.size) parts.push(normalized.size.label);
  if (normalized.addOns.length) {
    parts.push(`Add-ons: ${normalized.addOns.map((addOn) => addOn.label).join(", ")}`);
  }
  if (normalized.spiceLevel && normalized.spiceLevel !== "Not spicy") {
    parts.push(normalized.spiceLevel);
  }
  if (normalized.specialInstructions) {
    parts.push(`Note: ${normalized.specialInstructions}`);
  }

  return parts.join(" · ");
}
