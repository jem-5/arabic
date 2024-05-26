import { DisplayNavigation } from "@/components/DisplayNavigation";
import "./globals.css";
import theme from "./theme.js";
import { AuthContextProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import Image from "next/image";
import BgImg from "../public/bg.jpg";

export const metadata = {
  title: "Learn Arabic Today",
  description: "30 Minute Lessons",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className=" min-h-screen flex flex-col justify-start items-center ">
        <AuthContextProvider>
          <DisplayNavigation />
          {children}
          <Footer />
          <Image
            src={BgImg}
            fill
            alt="hero"
            priority
            className="bg-contain -z-30 absolute "
          />
        </AuthContextProvider>
      </body>
    </html>
  );
}
