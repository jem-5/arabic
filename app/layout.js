import { Navigation } from "@/components/Navigation";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";

import Script from "next/script";

export const metadata = {
  title: "Learn Arabic Today",
  description: "15 Minute Modules",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-screen h-full ">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9287702370703879"
          crossorigin="anonymous"
        ></Script>
      </head>

      <body className=" min-h-full flex flex-col justify-between items-center  min-w-screen   bg-[url('/bg-mobile.jpg')]  md:bg-[url('/bg.jpg')] bg-cover">
        <AuthContextProvider>
          <Navigation />
          {children}
          <Footer />
        </AuthContextProvider>

        <script
          async
          defer
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
        <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerpolicy="no-referrer-when-downgrade"
          />
        </noscript>
        {/* 
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q9R3EYD27Y"
        />

        <script id="google-analytics">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Q9R3EYD27Y');
  `}
        </script> */}
      </body>
    </html>
  );
}
