"use client";

import { useMemo } from "react";
import { useFoodie } from "../../providers";
import SavedPageView from "./SavedPageView";
import { foodItems } from "../../lib/food-data";

export default function SavedPage() {
  const { favoriteIds, toggleFavorite, openCustomization } = useFoodie();
  const items = useMemo(
    () => foodItems.filter((item) => favoriteIds.includes(item.id)),
    [favoriteIds],
  );

  return (
    <SavedPageView
      items={items}
      favoriteIds={favoriteIds}
      onToggleFavorite={toggleFavorite}
      onAddToCart={openCustomization}
    />
  );
}

