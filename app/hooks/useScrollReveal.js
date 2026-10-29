"use client";

import { useEffect, useRef } from "react";

export default function useScrollReveal(existingRef) {
  const internalRef = useRef(null);
  const targetRef = existingRef || internalRef;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return undefined;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      target.classList.add("scroll-reveal-visible");
      return undefined;
    }

    target.classList.add("scroll-reveal-ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        target.classList.add("scroll-reveal-visible");
        observer.unobserve(target);
      },
      { threshold: 0.16, rootMargin: "0px 0px -28px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  return targetRef;
}
