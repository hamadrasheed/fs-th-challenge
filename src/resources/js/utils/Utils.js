import resolveConfig from "tailwindcss/resolveConfig";
import { APP_TITLE } from "../vars/types";

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig("./src/css/tailwind.config.js");
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const formatThousands = (value) =>
  Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const wordLimit = (string, maxLength = 30) => {
  const index = string.indexOf(" ", maxLength);
  return index === -1 ? string : string.substring(0, index);
};

export const titleScroller = (page_name = null) => {
  let title = page_name ? `${page_name} | ${APP_TITLE}` : APP_TITLE,
    seTime;

  (function titleScroller(text) {
    document.title = text;
    seTime = window.setTimeout(() => {
      titleScroller(text.substr(1) + text.substr(0, 1));
    }, 500);
  })(title + " ~ ");

  return () => window.clearTimeout(seTime);
};
