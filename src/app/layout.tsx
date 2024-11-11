import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "./toast-provider";
import ReduxProvider from "./redux-store";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "The Playlist",
  description: "Generated by create next app",
  applicationName: "the Playlist",
  icons: [
    { rel: "apple-touch-icon", url: "/apple-icon.png" },
    { rel: "icon", url: "/icon-192x192.png" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "the Playlist",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <ToastProvider>
            <div>{children}</div>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
