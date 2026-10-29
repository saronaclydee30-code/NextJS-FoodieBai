"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppIcon from "./components/shared/AppIcon";
import { defaultFavorites, foodItems } from "./lib/food-data";

const FoodieContext = createContext(null);

const defaultDeliverySettings = {
  deliveryAddress: "123 Foodie Street, Metro Manila",
  phoneNumber: "",
  deliveryInstructions: "",
  contactlessDelivery: false,
};

const defaultFontScale = 1.1;
const defaultDarkMode = false;

export function isOrderCancellable(order) {
  return ["confirmed", "preparing"].includes(
    String(order?.status || "").toLowerCase(),
  );
}

export function FoodieProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(defaultFavorites);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [fontScale, setFontScale] = useState(defaultFontScale);
  const [darkMode, setDarkMode] = useState(defaultDarkMode);
  const [deliverySettings, setDeliverySettings] = useState(
    defaultDeliverySettings,
  );
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    const loadSession = () => {
      try {
        const savedUser = window.localStorage.getItem("foodiebai-user");
        const savedFavorites = window.localStorage.getItem(
          "foodiebai-favorites",
        );
        const savedCart = window.localStorage.getItem("foodiebai-cart");
        const savedOrders = window.localStorage.getItem("foodiebai-orders");
        const savedFontScale = window.localStorage.getItem(
          "foodiebai-font-scale",
        );
        const savedDarkMode = window.localStorage.getItem(
          "foodiebai-dark-mode",
        );
        const savedDeliverySettings = window.localStorage.getItem(
          "foodiebai-delivery-settings",
        );

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedFavorites) setFavoriteIds(JSON.parse(savedFavorites));
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(
              parsedCart.map((cartItem) => {
                const foodItem = foodItems.find(
                  (item) => item.id === cartItem.id,
                );
                return foodItem
                  ? {
                      ...cartItem,
                      image: foodItem.image || cartItem.image || "",
                    }
                  : cartItem;
              }),
            );
          }
        }
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedFontScale !== null) {
          const parsedFontScale = Number(savedFontScale);
          if (Number.isFinite(parsedFontScale)) {
            setFontScale(Math.min(1.3, Math.max(1, parsedFontScale)));
          }
        }
        if (savedDarkMode !== null) {
          setDarkMode(savedDarkMode === "true");
        }
        if (savedDeliverySettings) {
          const parsedSettings = JSON.parse(savedDeliverySettings);
          if (
            parsedSettings &&
            typeof parsedSettings === "object" &&
            !Array.isArray(parsedSettings)
          ) {
            setDeliverySettings({
              deliveryAddress:
                typeof parsedSettings.deliveryAddress === "string"
                  ? parsedSettings.deliveryAddress
                  : defaultDeliverySettings.deliveryAddress,
              phoneNumber:
                typeof parsedSettings.phoneNumber === "string"
                  ? parsedSettings.phoneNumber
                  : defaultDeliverySettings.phoneNumber,
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

    if (user)
      window.localStorage.setItem("foodiebai-user", JSON.stringify(user));
    else window.localStorage.removeItem("foodiebai-user");
    window.localStorage.setItem(
      "foodiebai-favorites",
      JSON.stringify(favoriteIds),
    );
    window.localStorage.setItem("foodiebai-cart", JSON.stringify(cartItems));
    window.localStorage.setItem("foodiebai-orders", JSON.stringify(orders));
    window.localStorage.setItem("foodiebai-font-scale", String(fontScale));
    window.localStorage.setItem("foodiebai-dark-mode", String(darkMode));
    window.localStorage.setItem(
      "foodiebai-delivery-settings",
      JSON.stringify(deliverySettings),
    );
  }, [
    hydrated,
    user,
    favoriteIds,
    cartItems,
    orders,
    fontScale,
    darkMode,
    deliverySettings,
  ]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      String(fontScale),
    );
  }, [fontScale]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  const updateFontScale = (value) => {
    const requestedScale = Number(value);
    if (!Number.isFinite(requestedScale)) return;
    setFontScale(Math.min(1.3, Math.max(1, requestedScale)));
  };

  const signUp = ({ username, email, password }) => {
    if (!username.trim()) return { error: "Please enter a username." };
    if (!email.trim()) return { error: "Please enter an email." };
    if (password.length < 6)
      return { error: "Password must be at least 6 characters." };

    const nextUser = { username: username.trim(), email: email.trim() };
    setUser(nextUser);
    showToast(`Account created! Welcome, ${nextUser.username}`);
    return { ok: true };
  };

  const signIn = ({ identifier, password }) => {
    if (!identifier.trim())
      return { error: "Please enter your email or username." };
    if (!password.trim()) return { error: "Please enter your password." };

    const nextUser = {
      username: identifier.includes("@") ? "FoodieUser" : identifier.trim(),
      email: identifier.includes("@")
        ? identifier.trim()
        : "user@foodiebai.com",
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
      wasFavorite
        ? currentIds.filter((favoriteId) => favoriteId !== id)
        : [...currentIds, id],
    );

    if (item)
      showToast(`${wasFavorite ? "Removed from" : "Saved to"} favorites`);
  };

  const addToCart = (item) => {
    if (
      cartItems.length > 0 &&
      !cartItems.some((cartItem) => cartItem.restaurant === item.restaurant)
    ) {
      showToast("Please check out one restaurant at a time");
      return;
    }

    setCartItems((currentItems) => {
      const existing = currentItems.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
    showToast(`${item.title} added to your cart`);
  };

  const changeQuantity = (id, delta) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const updateDeliverySettings = (nextSettings) => {
    setDeliverySettings({
      deliveryAddress: nextSettings.deliveryAddress.trim(),
      phoneNumber: (nextSettings.phoneNumber || "").trim(),
      deliveryInstructions: nextSettings.deliveryInstructions.trim(),
      contactlessDelivery: nextSettings.contactlessDelivery,
    });
  };

  const placeOrder = (checkoutDetails = {}) => {
    if (!cartItems.length) return null;

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = 49;
    const discountAmount = Math.min(
      subtotal,
      Math.max(0, Number(checkoutDetails.discountAmount) || 0),
    );
    const order = {
      orderId: `ORD-${String(Date.now()).slice(-6)}`,
      items: cartItems,
      totalPrice: subtotal + deliveryFee - discountAmount,
      deliveryFee,
      discountAmount,
      promoCode: checkoutDetails.promoCode || "",
      paymentMethod: checkoutDetails.paymentMethod || "Cash on Delivery",
      estimatedDelivery: "35-50 min",
      deliveryAddress: deliverySettings.deliveryAddress,
      phoneNumber: deliverySettings.phoneNumber,
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

  const cancelOrder = (orderId, reason) => {
    const cancellationReason =
      typeof reason === "string" ? reason.trim() : "";
    if (!cancellationReason) {
      showToast("Please choose a cancellation reason.");
      return false;
    }

    const order = orders.find((currentOrder) => currentOrder.orderId === orderId);
    if (!order) {
      showToast("Order not found.");
      return false;
    }
    if (!isOrderCancellable(order)) {
      showToast("This order can no longer be canceled.");
      return false;
    }

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.orderId === orderId
          ? {
              ...currentOrder,
              status: "Canceled",
              cancelReason: cancellationReason,
            }
          : currentOrder,
      ),
    );
    showToast("Order canceled.");
    return true;
  };

  const removeOrder = (orderId) => {
    const orderExists = orders.some(
      (currentOrder) => currentOrder.orderId === orderId,
    );
    if (!orderExists) {
      showToast("Order not found.");
      return false;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((currentOrder) => currentOrder.orderId !== orderId),
    );
    showToast("Order removed from your history.");
    return true;
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
    fontScale,
    setFontScale: updateFontScale,
    darkMode,
    setDarkMode,
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
    cancelOrder,
    removeOrder,
    updateDeliverySettings,
  };

  return (
    <FoodieContext.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-icon">
            <AppIcon name="check" size={15} stroke={2.5} />
          </span>
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
