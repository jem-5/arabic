import { DisplayNavigation } from "@/components/DisplayNavigation";
import "./globals.css";
import theme from "./theme.js";
import { AuthContextProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";

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
        </AuthContextProvider>
      </body>
    </html>
  );
}
