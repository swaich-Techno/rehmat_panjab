"use client";

import { useCallback, useSyncExternalStore } from "react";

const cache = new Map<string, { raw: string | null; value: unknown }>();

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("rp-local", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("rp-local", callback);
  };
}

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readCached<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  const value = parse(raw, fallback);
  cache.set(key, { raw, value });
  return value;
}

export function emitLocal() {
  window.dispatchEvent(new Event("rp-local"));
}

export function writeLocalJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  cache.delete(key);
  emitLocal();
}

export function useLocalJson<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    subscribe,
    () => readCached(key, fallback),
    () => fallback,
  );
}

export function useLocalJsonWriter<T>(key: string) {
  return useCallback((value: T) => {
    writeLocalJson(key, value);
  }, [key]);
}
