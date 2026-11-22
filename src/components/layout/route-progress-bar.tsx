"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteProgressBar() {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const growIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isFirstRender = useRef(true);

  function start() {

    if (growIntervalRef.current) return; // already running

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setVisible(true);
    setProgress(12);

    // Creep toward (but never reach) 90% while we wait for the real
    // navigation to land — the remaining 10% snaps in on finish().
    growIntervalRef.current = setInterval(() => {
      setProgress((current) =>
        current < 90 ? current + (90 - current) * 0.12 : current
      );
    }, 200);

  }

  function finish() {

    if (growIntervalRef.current) {
      clearInterval(growIntervalRef.current);
      growIntervalRef.current = null;
    }

    setProgress(100);

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);

  }

  // The route actually changed — whatever we were waiting on has
  // landed, so complete the bar and fade it out.
  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    finish();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Start the bar the moment a real internal navigation is clicked —
  // App Router has no public "navigation started" event, so we catch
  // it at the click itself, one tick before Next takes over.
  useEffect(() => {

    function handleClick(event: MouseEvent) {

      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const isExternal = /^[a-z]+:\/\//i.test(href) && anchor.host !== window.location.host;
      if (isExternal) return;

      if (href === window.location.pathname + window.location.search) {
        return;
      }

      start();

    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);

  }, []);

  useEffect(() => {
    return () => {
      if (growIntervalRef.current) clearInterval(growIntervalRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent">
      <div
        className="h-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

}