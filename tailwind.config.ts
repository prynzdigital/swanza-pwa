import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ── Design System Color Tokens ────────────────────────────────────────────
      // Source: design-system.md — all values token-for-token
      colors: {
        // App Shell Palette (Dark — authenticated views)
        "surface-app": "#0D0F0F",
        "surface-card": "#161A1A",
        "surface-card-hover": "#1E2424",
        "surface-divider": "#252B2B",
        primary: "#00D9BE",
        "primary-hover": "#00BFA8",
        "primary-dim": "#00D9BE26",
        "text-on-dark": "#F0F4F4",
        "text-muted-dark": "#8A9B9B",
        "text-disabled-dark": "#445252",
        "icon-on-dark": "#C4D0D0",
        destructive: "#FF4D4D",
        "destructive-hover": "#E63939",
        warning: "#F5A623",
        // Public Marketing Palette (Light — unauthenticated pages)
        "surface-page": "#FAFAFA",
        "surface-white": "#FFFFFF",
        "surface-section-alt": "#F2F4F4",
        "surface-dark-band": "#0D1414",
        "primary-light": "#009E89",
        "primary-light-hover": "#007F6E",
        "text-primary": "#111818",
        "text-secondary": "#4A5A5A",
        "text-muted": "#7A8C8C",
        border: "#E0E8E8",
        // Status Colors — job lifecycle
        "status-assigned": "#6C8EEF",
        "status-assigned-bg": "#1A2040",
        "status-assigned-text": "#B8C8FF",
        "status-accepted": "#4FC3F7",
        "status-accepted-bg": "#0A2535",
        "status-accepted-text": "#B0E8FF",
        "status-en-route": "#F5A623",
        "status-en-route-bg": "#2A1C00",
        "status-en-route-text": "#FFD580",
        "status-in-progress": "#00D9BE",
        "status-in-progress-bg": "#00312C",
        "status-in-progress-text": "#80EDE4",
        "status-completed": "#4CAF7D",
        "status-completed-bg": "#0A2018",
        "status-completed-text": "#A8E6C2",
      },
      // ── Font Families ─────────────────────────────────────────────────────────
      // Source: design-system.md Typography Scale
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: [
          "var(--font-jetbrains-mono)",
          "JetBrains Mono",
          "Menlo",
          "monospace",
        ],
      },
      // ── Typography Scale ──────────────────────────────────────────────────────
      fontSize: {
        // Matches design-system.md type scale
        "display-h1": ["52px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-h2": ["36px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-h3": ["24px", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-h4": ["18px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "mobile-h1": ["32px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "mobile-h2": ["26px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "mobile-h3": ["20px", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "body-lg": ["18px", { lineHeight: "1.55" }],
        body: ["16px", { lineHeight: "1.6" }],
        sm: ["14px", { lineHeight: "1.45" }],
        xs: ["12px", { lineHeight: "1.4" }],
        "label-ui": ["13px", { lineHeight: "1.0", letterSpacing: "0.06em" }],
        "mono-data": ["15px", { lineHeight: "1.3" }],
      },
      // ── Spacing Scale ─────────────────────────────────────────────────────────
      // Source: design-system.md Spacing Scale (4px base)
      spacing: {
        "space-xs": "4px",
        "space-sm": "8px",
        "space-md": "16px",
        "space-lg": "24px",
        "space-xl": "40px",
        "space-2xl": "64px",
        "space-3xl": "96px",
      },
      // ── Border Radius ─────────────────────────────────────────────────────────
      borderRadius: {
        lg: "12px", // content cards
        md: "8px",  // badges/chips
        sm: "6px",  // buttons
        DEFAULT: "8px",
      },
      // ── Max Width ─────────────────────────────────────────────────────────────
      maxWidth: {
        content: "1200px",
        readable: "720px",
        card: "960px",
        narrow: "560px",
      },
      // ── Animations ────────────────────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ring-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ring-pulse": "ring-pulse 1.5s ease infinite",
        shimmer: "shimmer 1.5s infinite linear",
        "slide-in-right": "slide-in-from-right 200ms ease-out",
        "slide-in-left": "slide-in-from-left 200ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
