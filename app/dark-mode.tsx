"use client";

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

export default function DarkModeSwitch() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return null;
}
