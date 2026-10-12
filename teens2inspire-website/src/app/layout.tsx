import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Teens2Inspire — Inspiring Jewish teen girls", template: "%s | Teens2Inspire" }, description: "A thoughtful media space for Jewish teen girls. Real conversations, fresh perspectives, and inspiration for wherever life finds you.", applicationName: "Teens2Inspire", icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" } };
export const viewport: Viewport = { themeColor: "#10090e", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
