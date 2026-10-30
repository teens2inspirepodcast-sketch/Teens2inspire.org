import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./streaming-refresh.css";
export const metadata: Metadata = { title: { default: "Teens2Inspire — Inspiring Jewish teen girls", template: "%s | Teens2Inspire" }, description: "A thoughtful media space for Jewish teen girls. Real conversations, fresh perspectives, and inspiration for wherever life finds you.", applicationName: "Teens2Inspire", icons: { icon: [{ url: "/favicon-v2.png", type: "image/png", sizes: "512x512" }, { url: "/icon.svg", type: "image/svg+xml", sizes: "any" }], apple: [{ url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" }] } };
export const viewport: Viewport = { themeColor: "#10090e", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
