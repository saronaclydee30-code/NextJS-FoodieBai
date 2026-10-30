const DEMO_ACCOUNTS_KEY = "foodiebai-accounts";

function readDemoAccounts() {
  const savedAccounts = window.localStorage.getItem(DEMO_ACCOUNTS_KEY);
  if (savedAccounts === null) return [];

  const accounts = JSON.parse(savedAccounts);
  if (!Array.isArray(accounts)) {
    throw new Error("Saved accounts could not be read.");
  }
  return accounts;
}

function matchesIdentifier(account, identifier) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  if (!account || typeof account !== "object") return false;

  return [account.email, account.username].some(
    (value) =>
      typeof value === "string" &&
      value.trim().toLowerCase() === normalizedIdentifier,
  );
}

export function findDemoAccount(identifier) {
  return readDemoAccounts().find((account) =>
    matchesIdentifier(account, identifier),
  );
}

export function saveDemoAccount(account) {
  const accounts = readDemoAccounts();
  window.localStorage.setItem(
    DEMO_ACCOUNTS_KEY,
    JSON.stringify([...accounts, account]),
  );
}

export function updateDemoAccountPassword(identifier, password) {
  const accounts = readDemoAccounts();
  const accountIndex = accounts.findIndex((account) =>
    matchesIdentifier(account, identifier),
  );
  if (accountIndex === -1) return false;

  accounts[accountIndex] = { ...accounts[accountIndex], password };
  window.localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
  return true;
}

export function generateDemoResetCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
