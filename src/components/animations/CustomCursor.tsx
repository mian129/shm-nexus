"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseEnter = () => cursor.classList.add("hovering");
    const handleMouseLeave = () => cursor.classList.remove("hovering");

    document.addEventListener("mousemove", handleMouseMove);

    const tracked = new WeakSet<EventTarget>();

    function attachToElement(el: Element) {
      if (tracked.has(el)) return;
      tracked.add(el);
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    document.querySelectorAll("a, button, [role='button']").forEach(attachToElement);

    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, [role='button']").forEach(attachToElement);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="cursor-follower" aria-hidden="true" />;
}
