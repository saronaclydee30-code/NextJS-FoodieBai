"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFoodie } from "../../providers";
import HomePageView from "./HomePageView";
import { foodItems, restaurantProfiles } from "../../lib/food-data";

export default function HomePage() {
  const router = useRouter();
  const { user, favoriteIds, toggleFavorite, openCustomization } = useFoodie();
  const [search, setSearch] = useState("");
  const [restaurant, setRestaurant] = useState("All");
  const [category, setCategory] = useState("All");
  const query = search.trim().toLowerCase();

  const items = useMemo(
    () => foodItems.filter((item) => {
      const matchesRestaurant = restaurant === "All" || item.restaurant === restaurant;
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = !query || [item.title, item.restaurant, item.category, item.description]
        .some((value) => value.toLowerCase().includes(query));
      return matchesRestaurant && matchesCategory && matchesSearch;
    }),
    [query, restaurant, category],
  );

  return (
    <HomePageView
      search={search}
      setSearch={setSearch}
      username={user?.username}
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      category={category}
      setCategory={setCategory}
      items={items}
      favoriteIds={favoriteIds}
      onToggleFavorite={toggleFavorite}
      onAddToCart={openCustomization}
      restaurantProfiles={restaurantProfiles}
      onOpenMenu={() => router.push("/menu")}
    />
  );
}
