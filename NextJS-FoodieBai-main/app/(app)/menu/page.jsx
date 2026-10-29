"use client";

import { useMemo, useState } from "react";
import { useFoodie } from "../../providers";
import MenuPageView from "./MenuPageView";
import { categories, foodItems } from "../../lib/food-data";

export default function MenuPage() {
  const { favoriteIds, toggleFavorite, addToCart } = useFoodie();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const query = search.trim().toLowerCase();
  const items = useMemo(
    () => foodItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = !query || [item.title, item.restaurant, item.category, item.description]
        .some((value) => value.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    }),
    [category, query],
  );

  return (
    <MenuPageView
      search={search}
      setSearch={setSearch}
      categories={categories}
      category={category}
      setCategory={setCategory}
      items={items}
      favoriteIds={favoriteIds}
      onToggleFavorite={toggleFavorite}
      onAddToCart={addToCart}
    />
  );
}
