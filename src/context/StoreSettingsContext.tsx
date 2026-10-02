"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StoreSettingsConfig } from "@/types/ecommerce";

interface StoreSettingsContextType {
  settings: StoreSettingsConfig | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
});

export function StoreSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: StoreSettingsConfig | null;
}) {
  const [settings, setSettings] = useState<StoreSettingsConfig | null>(
    initialSettings || null
  );
  const [loading, setLoading] = useState(!initialSettings);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok && !ignore) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (!initialSettings) {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [initialSettings]);

  // Apply custom theme colors if present
  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      if (settings.theme.primaryColor) {
        root.style.setProperty("--color-primary", settings.theme.primaryColor);
      }
      if (settings.theme.accentColor) {
        root.style.setProperty("--color-accent", settings.theme.accentColor);
      }
      if (settings.theme.borderRadius) {
        root.style.setProperty("--border-radius-base", settings.theme.borderRadius);
      }
    }
  }, [settings?.theme]);

  // Apply custom dynamic favicon if set in StoreSettings
  useEffect(() => {
    const faviconUrl = settings?.storeProfile?.favicon;
    if (faviconUrl) {
      const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (iconLinks.length > 0) {
        iconLinks.forEach((link) => {
          link.href = faviconUrl;
        });
      } else {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = faviconUrl;
        document.head.appendChild(link);
      }
    }
  }, [settings?.storeProfile?.favicon]);

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  return context;
}
