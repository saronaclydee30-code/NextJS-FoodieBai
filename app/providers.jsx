"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AppIcon from "./components/shared/AppIcon";
import { defaultFavorites, foodItems } from "./lib/food-data";

const FoodieContext = createContext(null);

const defaultDeliverySettings = {
  deliveryAddress: "123 Foodie Street, Metro Manila",
  deliveryInstructions: "",
  contactlessDelivery: false,
};

export function FoodieProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(defaultFavorites);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState(defaultDeliverySettings);
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    const loadSession = () => {
      try {
        const savedUser = window.localStorage.getItem("foodiebai-user");
        const savedFavorites = window.localStorage.getItem("foodiebai-favorites");
        const savedCart = window.localStorage.getItem("foodiebai-cart");
        const savedOrders = window.localStorage.getItem("foodiebai-orders");
        const savedDeliverySettings = window.localStorage.getItem("foodiebai-delivery-settings");

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedFavorites) setFavoriteIds(JSON.parse(savedFavorites));
        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedDeliverySettings) {
          const parsedSettings = JSON.parse(savedDeliverySettings);
          if (parsedSettings && typeof parsedSettings === "object" && !Array.isArray(parsedSettings)) {
            setDeliverySettings({
              deliveryAddress:
                typeof parsedSettings.deliveryAddress === "string"
                  ? parsedSettings.deliveryAddress
                  : defaultDeliverySettings.deliveryAddress,
              deliveryInstructions:
                typeof parsedSettings.deliveryInstructions === "string"
                  ? parsedSettings.deliveryInstructions
                  : defaultDeliverySettings.deliveryInstructions,
              contactlessDelivery:
                typeof parsedSettings.contactlessDelivery === "boolean"
                  ? parsedSettings.contactlessDelivery
                  : defaultDeliverySettings.contactlessDelivery,
            });
          }
        }
      } catch {
        // A malformed local session should not stop the storefront from rendering.
      }

      setHydrated(true);
    };

    const sessionTimer = window.setTimeout(loadSession, 0);
    return () => window.clearTimeout(sessionTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (user) window.localStorage.setItem("foodiebai-user", JSON.stringify(user));
    else window.localStorage.removeItem("foodiebai-user");
    window.localStorage.setItem("foodiebai-favorites", JSON.stringify(favoriteIds));
    window.localStorage.setItem("foodiebai-cart", JSON.stringify(cartItems));
    window.localStorage.setItem("foodiebai-orders", JSON.stringify(orders));
    window.localStorage.setItem("foodiebai-delivery-settings", JSON.stringify(deliverySettings));
  }, [hydrated, user, favoriteIds, cartItems, orders, deliverySettings]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  const signUp = ({ username, email, password }) => {
    if (!username.trim()) return { error: "Please enter a username." };
    if (!email.trim()) return { error: "Please enter an email." };
    if (password.length < 6) return { error: "Password must be at least 6 characters." };

    const nextUser = { username: username.trim(), email: email.trim() };
    setUser(nextUser);
    showToast(`Account created! Welcome, ${nextUser.username}`);
    return { ok: true };
  };

  const signIn = ({ identifier, password }) => {
    if (!identifier.trim()) return { error: "Please enter your email or username." };
    if (!password.trim()) return { error: "Please enter your password." };

    const nextUser = {
      username: identifier.includes("@") ? "FoodieUser" : identifier.trim(),
      email: identifier.includes("@") ? identifier.trim() : "user@foodiebai.com",
    };
    setUser(nextUser);
    showToast(`Welcome back, ${nextUser.username}`);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
    setOrders([]);
  };

  const toggleFavorite = (id) => {
    const item = foodItems.find((food) => food.id === id);
    const wasFavorite = favoriteIds.includes(id);

    setFavoriteIds((currentIds) =>
      wasFavorite ? currentIds.filter((favoriteId) => favoriteId !== id) : [...currentIds, id],
    );

    if (item) showToast(`${wasFavorite ? "Removed from" : "Saved to"} favorites`);
  };

  const addToCart = (item) => {
    setCartItems((currentItems) => {
      const existing = currentItems.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
    showToast(`${item.title} added to your cart`);
  };

  const changeQuantity = (id, delta) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const updateDeliverySettings = (nextSettings) => {
    setDeliverySettings({
      deliveryAddress: nextSettings.deliveryAddress.trim(),
      deliveryInstructions: nextSettings.deliveryInstructions.trim(),
      contactlessDelivery: nextSettings.contactlessDelivery,
    });
  };

  const placeOrder = () => {
    if (!cartItems.length) return null;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
      orderId: `ORD-${String(Date.now()).slice(-6)}`,
      items: cartItems,
      totalPrice: subtotal + 49,
      deliveryAddress: deliverySettings.deliveryAddress,
      deliveryInstructions: deliverySettings.deliveryInstructions,
      contactlessDelivery: deliverySettings.contactlessDelivery,
      orderTime: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      status: "Preparing",
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCartItems([]);
    return order;
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const value = {
    user,
    hydrated,
    favoriteIds,
    cartItems,
    orders,
    deliverySettings,
    cartCount,
    showToast,
    signUp,
    signIn,
    logout,
    toggleFavorite,
    addToCart,
    changeQuantity,
    placeOrder,
    updateDeliverySettings,
  };

  return (
    <FoodieContext.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-icon"><AppIcon name="check" size={15} stroke={2.5} /></span>
          {toast}
        </div>
      )}
    </FoodieContext.Provider>
  );
}

export function useFoodie() {
  const context = useContext(FoodieContext);
  if (!context) throw new Error("useFoodie must be used inside FoodieProvider");
  return context;
}
