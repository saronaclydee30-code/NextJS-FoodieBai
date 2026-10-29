"use client";

import Image from "next/image";
import { useState } from "react";

export default function FoodItemImage({ item, fallbackClassName, sizes }) {
  const [failedSrc, setFailedSrc] = useState("");

  if (!item.image || failedSrc === item.image) {
    return <span className={fallbackClassName} aria-hidden="true">{item.emoji}</span>;
  }

  const isRemoteImage = /^https?:\/\//i.test(item.image);

  return (
    <Image
      className="food-item-photo"
      src={item.image}
      alt=""
      fill
      sizes={sizes}
      unoptimized={isRemoteImage}
      onError={() => setFailedSrc(item.image)}
    />
  );
}
