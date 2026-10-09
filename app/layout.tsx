import type { Metadata, Viewport } from "next"; import "./globals.css";
export const metadata: Metadata = { title: "Teens2Inspire | Inspiring Jewish teen girls", description: "A community, media library, and source of inspiration for Jewish teen girls.", metadataBase: new URL("https://teens2inspire.org"), icons: { icon: "/favicon.svg" } };
export const viewport: Viewport = { themeColor: "#211016" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }