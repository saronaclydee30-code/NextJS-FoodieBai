import "./styles/base.css";
import "./legal.css";
import "./welcome/welcome.css";
import "./auth/auth.css";
import "./(app)/app-shell.css";
import "./(app)/home/home.css";
import "./components/food/food-catalog.css";
import "./components/food/food-extra.css";
import "./(app)/menu/menu.css";
import "./(app)/saved/saved.css";
import "./(app)/cart/cart.css";
import "./(app)/orders/orders.css";
import "./(app)/profile/profile.css";
import "./(app)/settings/settings.css";
import "./(app)/cart/order-confirmation.css";
import "./(app)/restaurants/restaurants.css";
import "./(app)/orders/order-tracking.css";
import "./components/shared/feedback.css";
import { FoodieProvider } from "./providers";

export const metadata = {
  title: "FoodieBai | Good food, right to your door",
  description: "Order fresh favorites from local restaurants with FoodieBai.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FoodieProvider>{children}</FoodieProvider>
      </body>
    </html>
  );
}
