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
import FoodCustomizationModal from "./components/food/FoodCustomizationModal";
import {
  defaultFavorites,
  foodItems,
  getRestaurantById,
  restaurantSlug,
} from "./lib/food-data";
import {
  getCartLineId,
  getOptionsPrice,
  normalizeItemOptions,
} from "./lib/format";
import {
  getOrderStatusIndex,
  getOrderStatusIndexAt,
  ORDER_STATUSES,
  ORDER_STEP_DURATION_MS,
} from "./lib/order-utils";
import { saveDemoAccount } from "./lib/reset-pass";

const FoodieContext = createContext(null);

const defaultDeliverySettings = {
  houseNumber: "123",
  street: "Foodie Street",
  barangay: "Poblacion",
  city: "Makati, Metro Manila",
  deliveryAddress: "123 Foodie Street, Brgy. Poblacion, Makati, Metro Manila",
  phoneNumber: "",
  deliveryInstructions: "",
  contactlessDelivery: false,
};

const defaultFontScale = 1.1;
const defaultDarkMode = false;

export function isOrderCancellable(order) {
  return ["confirmed"].includes(
    String(order?.status || "").toLowerCase(),
  );
}

function normalizeCartItem(cartItem) {
  const foodItem = foodItems.find((item) => item.id === cartItem.id);
  const source = foodItem ? { ...foodItem, ...cartItem } : cartItem;
  const options = normalizeItemOptions(cartItem.options);
  const basePrice = Number(
    cartItem.basePrice ?? foodItem?.price ?? cartItem.price,
  ) || 0;
  const hasOptions = Boolean(cartItem.options);
  const price = hasOptions
    ? basePrice + getOptionsPrice(options)
    : Number(cartItem.price) || basePrice;

  return {
    ...source,
    basePrice,
    price,
    options,
    lineId: cartItem.lineId || getCartLineId(cartItem.id, options),
    restaurantId:
      cartItem.restaurantId || foodItem?.restaurantId || restaurantSlug(cartItem.restaurant),
    image: foodItem?.image || cartItem.image || "",
  };
}

function normalizeOrder(order) {
  const createdAt = Number(order.createdAt) || Date.now();
  const isCancelled = String(order.status || "").toLowerCase().includes("cancel");
  const statusIndex = isCancelled
    ? -1
    : Number.isFinite(Number(order.statusIndex))
      ? Number(order.statusIndex)
      : getOrderStatusIndex(order.status);
  const status = isCancelled
    ? "Cancelled"
    : ORDER_STATUSES[Math.max(0, Math.min(ORDER_STATUSES.length - 1, statusIndex))];

  return {
    ...order,
    createdAt,
    statusStartedAt: Number(order.statusStartedAt) || createdAt,
    estimatedArrivalAt:
      Number(order.estimatedArrivalAt) ||
      createdAt + ORDER_STEP_DURATION_MS * (ORDER_STATUSES.length - 1),
    statusIndex,
    status,
    items: Array.isArray(order.items)
      ? order.items.map(normalizeCartItem)
      : [],
  };
}

export function FoodieProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(defaultFavorites);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [fontScale, setFontScale] = useState(defaultFontScale);
  const [darkMode, setDarkMode] = useState(defaultDarkMode);
  const [deliverySettings, setDeliverySettings] = useState(
    defaultDeliverySettings,
  );
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [customizationItem, setCustomizationItem] = useState(null);
  const [customizationSession, setCustomizationSession] = useState(0);
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
        const savedReviews = window.localStorage.getItem("foodiebai-reviews");
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
            setCartItems(parsedCart.map(normalizeCartItem));
          }
        }
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            setOrders(parsedOrders.map(normalizeOrder));
          }
        }
        if (savedReviews) {
          const parsedReviews = JSON.parse(savedReviews);
          if (Array.isArray(parsedReviews)) setReviews(parsedReviews);
        }
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
              houseNumber:
                typeof parsedSettings.houseNumber === "string"
                  ? parsedSettings.houseNumber
                  : defaultDeliverySettings.houseNumber,
              street:
                typeof parsedSettings.street === "string"
                  ? parsedSettings.street
                  : defaultDeliverySettings.street,
              barangay:
                typeof parsedSettings.barangay === "string"
                  ? parsedSettings.barangay
                  : defaultDeliverySettings.barangay,
              city:
                typeof parsedSettings.city === "string"
                  ? parsedSettings.city
                  : defaultDeliverySettings.city,
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
    window.localStorage.setItem("foodiebai-reviews", JSON.stringify(reviews));
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
    reviews,
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

  useEffect(() => {
    if (!hydrated) return undefined;

    const advanceOrders = () => {
      setOrders((currentOrders) => {
        const now = Date.now();
        let changed = false;
        const nextOrders = currentOrders.map((order) => {
          if (
            String(order.status || "").toLowerCase().includes("cancel") ||
            order.statusIndex >= ORDER_STATUSES.length - 1
          ) {
            return order;
          }

          const nextStatusIndex = getOrderStatusIndexAt(order, now);
          if (nextStatusIndex === order.statusIndex) return order;

          changed = true;
          return {
            ...order,
            statusIndex: nextStatusIndex,
            status: ORDER_STATUSES[nextStatusIndex],
          };
        });

        return changed ? nextOrders : currentOrders;
      });
    };

    advanceOrders();
    const timer = window.setInterval(advanceOrders, 1000);
    return () => window.clearInterval(timer);
  }, [hydrated]);

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
    try {
      saveDemoAccount({ ...nextUser, password });
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Your account could not be saved.",
      };
    }

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
    showToast(identifier.includes("@") ? "Welcome back" : `Welcome back, ${nextUser.username}`);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
    setOrders([]);
  };

  const resetDemoData = () => {
    [
      "foodiebai-user",
      "foodiebai-accounts",
      "foodiebai-favorites",
      "foodiebai-cart",
      "foodiebai-orders",
      "foodiebai-reviews",
      "foodiebai-font-scale",
      "foodiebai-dark-mode",
      "foodiebai-delivery-settings",
    ].forEach((key) => window.localStorage.removeItem(key));

    setUser(null);
    setFavoriteIds(defaultFavorites);
    setCartItems([]);
    setOrders([]);
    setReviews([]);
    setFontScale(defaultFontScale);
    setDarkMode(defaultDarkMode);
    setDeliverySettings(defaultDeliverySettings);
    setCustomizationItem(null);
    showToast("Demo data reset. You can start fresh.");
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

  const openCustomization = (item) => {
    setCustomizationSession((currentSession) => currentSession + 1);
    setCustomizationItem(item);
  };

  const addToCart = (item, rawOptions = {}, requestedQuantity = 1) => {
    const restaurantId = item.restaurantId || restaurantSlug(item.restaurant);
    const restaurant = getRestaurantById(restaurantId);
    if (restaurant && !restaurant.isOpen) {
      showToast(`${restaurant.name} is currently closed`);
      return false;
    }

    if (
      cartItems.length > 0 &&
      !cartItems.some((cartItem) => cartItem.restaurant === item.restaurant)
    ) {
      showToast("Please check out one restaurant at a time");
      return false;
    }

    const catalogItem = foodItems.find((foodItem) => foodItem.id === item.id) || item;
    const options = normalizeItemOptions(rawOptions);
    const basePrice = Number(catalogItem.basePrice ?? catalogItem.price) || 0;
    const lineId = getCartLineId(catalogItem.id, options);
    const quantity = Math.max(1, Number(requestedQuantity) || 1);
    const cartItem = {
      ...catalogItem,
      ...item,
      basePrice,
      price: basePrice + getOptionsPrice(options),
      options,
      lineId,
      restaurantId,
      quantity,
    };

    setCartItems((currentItems) => {
      const existing = currentItems.find((currentItem) => currentItem.lineId === lineId);
      if (existing) {
        return currentItems.map((currentItem) =>
          currentItem.lineId === lineId
            ? { ...currentItem, quantity: currentItem.quantity + quantity }
            : currentItem,
        );
      }
      return [...currentItems, cartItem];
    });
    showToast(`${item.title} added to your cart`);
    return true;
  };

  const replaceCartWithItems = (items) => {
    const nextItems = items.map((item) => {
      const catalogItem = foodItems.find((foodItem) => foodItem.id === item.id) || item;
      const options = normalizeItemOptions(item.options);
      const basePrice = Number(catalogItem.basePrice ?? catalogItem.price) || 0;
      return {
        ...catalogItem,
        ...item,
        basePrice,
        price: basePrice + getOptionsPrice(options),
        options,
        lineId: getCartLineId(catalogItem.id, options),
        restaurantId: item.restaurantId || catalogItem.restaurantId || restaurantSlug(item.restaurant),
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });
    setCartItems(nextItems);
  };

  const clearCart = () => setCartItems([]);

  const changeQuantity = (lineId, delta) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          (item.lineId === lineId || item.id === lineId)
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const updateDeliverySettings = (nextSettings) => {
    const houseNumber = (nextSettings.houseNumber || "").trim();
    const street = (nextSettings.street || "").trim();
    const barangay = (nextSettings.barangay || "").trim();
    const city = (nextSettings.city || "").trim();
    const composedAddress = [
      houseNumber,
      street,
      barangay && `Brgy. ${barangay.replace(/^brgy\.\s*/i, "")}`,
      city,
    ].filter(Boolean).join(", ");

    setDeliverySettings({
      houseNumber,
      street,
      barangay,
      city,
      deliveryAddress: composedAddress || (nextSettings.deliveryAddress || "").trim(),
      phoneNumber: (nextSettings.phoneNumber || "").trim(),
      deliveryInstructions: (nextSettings.deliveryInstructions || "").trim(),
      contactlessDelivery: Boolean(nextSettings.contactlessDelivery),
    });
  };

  const placeOrder = (checkoutDetails = {}) => {
    if (!user) {
      showToast("Sign in or create an account to place your order.");
      return null;
    }
    if (!cartItems.length) return null;

    const restaurant = getRestaurantById(
      cartItems[0].restaurantId || restaurantSlug(cartItems[0].restaurant),
    );
    if (restaurant?.isOpen === false) {
      showToast("This restaurant is closed, so ordering is paused.");
      return null;
    }
    const createdAt = Date.now();
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = restaurant?.deliveryFee ?? 49;
    const discountAmount = Math.min(
      subtotal,
      Math.max(0, Number(checkoutDetails.discountAmount) || 0),
    );
    const order = {
      orderId: `ORD-${String(createdAt).slice(-6)}`,
      restaurantId: restaurant?.id || cartItems[0].restaurantId,
      restaurant: restaurant?.name || cartItems[0].restaurant,
      items: cartItems.map(normalizeCartItem),
      subtotal,
      totalPrice: subtotal + deliveryFee - discountAmount,
      deliveryFee,
      discountAmount,
      promoCode: checkoutDetails.promoCode || "",
      paymentMethod: checkoutDetails.paymentMethod || "Cash on Delivery",
      estimatedDelivery: restaurant?.deliveryTime || "35-50 min",
      estimatedArrivalAt: createdAt + ORDER_STEP_DURATION_MS * (ORDER_STATUSES.length - 1),
      statusStartedAt: createdAt,
      statusIndex: 0,
      createdAt,
      deliveryAddress: deliverySettings.deliveryAddress,
      phoneNumber: deliverySettings.phoneNumber,
      deliveryInstructions: deliverySettings.deliveryInstructions,
      contactlessDelivery: deliverySettings.contactlessDelivery,
      rider: {
        name: "Paolo Santos",
        rating: 4.9,
        phone: "0917 555 0142",
      },
      orderTime: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(createdAt)),
      status: "Confirmed",
      reviewed: false,
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
              status: "Cancelled",
              statusIndex: -1,
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

  const submitReview = (orderId, reviewDetails) => {
    const order = orders.find((currentOrder) => currentOrder.orderId === orderId);
    if (!order) {
      showToast("Order not found.");
      return null;
    }
    if (order.reviewed || reviews.some((review) => review.orderId === orderId)) {
      showToast("You have already rated this order.");
      return null;
    }
    if (String(order.status || "").toLowerCase() !== "delivered") {
      showToast("You can rate an order after it is delivered.");
      return null;
    }

    const review = {
      id: `review-${Date.now()}`,
      orderId,
      restaurantId: order.restaurantId,
      restaurant: order.restaurant,
      author: user?.username || "Foodie",
      rating: Math.min(5, Math.max(1, Number(reviewDetails.rating) || 1)),
      comment: String(reviewDetails.comment || "").trim(),
      tags: Array.isArray(reviewDetails.tags) ? reviewDetails.tags : [],
      date: "Just now",
    };

    setReviews((currentReviews) => [review, ...currentReviews]);
    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.orderId === orderId
          ? { ...currentOrder, reviewed: true, reviewId: review.id }
          : currentOrder,
      ),
    );
    showToast("Thanks for rating your order!");
    return review;
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
    reviews,
    fontScale,
    setFontScale: updateFontScale,
    darkMode,
    setDarkMode,
    deliverySettings,
    cartCount,
    showToast,
    openCustomization,
    closeCustomization: () => setCustomizationItem(null),
    signUp,
    signIn,
    logout,
    toggleFavorite,
    addToCart,
    replaceCartWithItems,
    clearCart,
    changeQuantity,
    placeOrder,
    cancelOrder,
    removeOrder,
    submitReview,
    updateDeliverySettings,
    resetDemoData,
  };

  return (
    <FoodieContext.Provider value={value}>
      {children}
      <FoodCustomizationModal
        key={customizationSession}
        item={customizationItem}
        onClose={() => setCustomizationItem(null)}
        onConfirm={(item, options, quantity) => {
          addToCart(item, options, quantity);
          setCustomizationItem(null);
        }}
      />
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
