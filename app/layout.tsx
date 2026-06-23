import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://swanza.com"
  ),
  title: {
    default: "Swanza | Book a Cleaner. Track Them to Your Door.",
    template: "%s | Swanza",
  },
  description:
    "Swanza is a residential cleaning marketplace. Book vetted independent cleaners online, pay upfront, and track your cleaner in real time.",
  openGraph: {
    type: "website",
    siteName: "Swanza",
    title: "Swanza | Book a Cleaner. Track Them to Your Door.",
    description:
      "Book residential cleaning in minutes. Upfront pricing, vetted cleaners, real-time tracking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Swanza — Book. Track. Done.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swanza | Book a Cleaner. Track Them to Your Door.",
    description:
      "Book residential cleaning in minutes. Upfront pricing, vetted cleaners, real-time tracking.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

// Viewport export — required in Next.js 15 for themeColor and viewport settings
export const viewport: Viewport = {
  themeColor: "#00D9BE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Force all routes to be dynamic — required because ClerkProvider validates
// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY at render time. Static generation is not
// compatible with Clerk auth. All marketing pages remain fast via CDN cache.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#009E89",
          colorBackground: "#FFFFFF",
          colorText: "#111818",
          colorInputBackground: "#FAFAFA",
          borderRadius: "8px",
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body className="min-h-screen antialiased">
          {children}
          <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(err) {
                      console.error('SW registration failed:', err);
                    });
                  });
                }
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
