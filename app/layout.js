import { Navigation } from "@/components/Navigation";
import "./globals.css";
import theme from "./theme.js";
import { AuthContextProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Image from "next/image";
import BgImg from "../public/bg.jpg";
import BgMobileImg from "../public/bg-mobile.jpg";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata = {
  title: "Learn Arabic Today",
  description: "15 Minute Modules",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-screen h-full ">
      <GoogleTagManager gtmId="G-Q9R3EYD27Y" />
      <body className=" min-h-full flex flex-col justify-between items-center  min-w-screen   bg-[url('/bg-mobile.jpg')]  md:bg-[url('/bg.jpg')] bg-cover">
        <AuthContextProvider>
          <Navigation />
          {children}
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
