"use client";

import { useMemo, useState } from "react";
import { useFoodie } from "../../providers";
import MenuPageView from "./MenuPageView";
import { categories, foodItems, restaurants } from "../../lib/food-data";

export default function MenuPage() {
  const { favoriteIds, toggleFavorite, addToCart } = useFoodie();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [restaurant, setRestaurant] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const query = search.trim().toLowerCase();
  const items = useMemo(() => {
    const filteredItems = foodItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesRestaurant =
        restaurant === "All" || item.restaurant === restaurant;
      const matchesSearch =
        !query ||
        [item.title, item.restaurant, item.category, item.description].some(
          (value) => value.toLowerCase().includes(query),
        );
      return matchesCategory && matchesRestaurant && matchesSearch;
    });

    return filteredItems.sort((first, second) => {
      if (sortBy === "price-low") return first.price - second.price;
      if (sortBy === "price-high") return second.price - first.price;
      if (sortBy === "rating") return second.rating - first.rating;
      return (
        second.rating - first.rating || first.title.localeCompare(second.title)
      );
    });
  }, [category, query, restaurant, sortBy]);

  return (
    <MenuPageView
      search={search}
      setSearch={setSearch}
      categories={categories}
      category={category}
      setCategory={setCategory}
      restaurants={restaurants}
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      sortBy={sortBy}
      setSortBy={setSortBy}
      items={items}
      favoriteIds={favoriteIds}
      onToggleFavorite={toggleFavorite}
      onAddToCart={addToCart}
    />
  );
}
