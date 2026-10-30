export const ORDER_STATUSES = [
  "Confirmed",
  "Preparing",
  "Picked up",
  "On the way",
  "Delivered",
];

// A short interval keeps each delivery state readable.
export const ORDER_STEP_DURATION_MS = 18_000;

export function getOrderStatusIndex(status) {
  const normalizedStatus = String(status || "").toLowerCase();
  const index = ORDER_STATUSES.findIndex(
    (step) => step.toLowerCase() === normalizedStatus,
  );

  if (index >= 0) return index;
  if (normalizedStatus.includes("cancel")) return -1;
  if (normalizedStatus.includes("prepar")) return 1;
  if (normalizedStatus.includes("pick")) return 2;
  if (normalizedStatus.includes("way")) return 3;
  if (normalizedStatus.includes("deliver")) return 4;
  return 0;
}

export function getOrderStatusIndexAt(order, now = Date.now()) {
  if (String(order?.status || "").toLowerCase().includes("cancel")) return -1;
  if (order?.statusIndex >= ORDER_STATUSES.length - 1) return ORDER_STATUSES.length - 1;

  const startedAt = Number(order?.statusStartedAt || order?.createdAt || now);
  const elapsed = Math.max(0, now - startedAt);
  const elapsedIndex = Math.floor(elapsed / ORDER_STEP_DURATION_MS);
  return Math.min(
    ORDER_STATUSES.length - 1,
    Math.max(0, Number(order?.statusIndex) || 0, elapsedIndex),
  );
}

export function formatCountdown(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
