import "./globals.css";
import { Inter } from "next/font/google";
import AppProvider from "./app-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Headless Store",
  description: "by @asumaran",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
