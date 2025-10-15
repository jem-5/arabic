import { Navigation } from "@/components/Navigation";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";

import Script from "next/script";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata = {
  title:
    "Arabic Road - Learn Arabic Online | Free Arabic Language Learning Platform",
  description:
    "Learn Arabic for free with ArabicRoad! Access vocabulary with relevant photos, Arabic voice narration, and English transliteration. No account needed. Start learning today!",
  keywords:
    "Learn Arabic, Arabic language, Arabic lessons, Free Arabic learning, Arabic vocabulary, Arabic pronunciation, Arabic voice narration, Arabic transliteration, Arabic for beginners, ArabicRoad",
  charset: "UTF-8",
  metadataBase: new URL("https://arabicroad.com"),
  openGraph: {
    siteName:
      "Arabic Road - Learn Arabic Online | Free Arabic Language Learning Platform",
    type: "website",
    locale: "en_US",

    url: "https://arabicroad.com/",
    title:
      "Arabic Road - Learn Arabic Online | Free Arabic Language Learning Platform",
    description:
      "Learn Arabic for free with ArabicRoad! Access vocabulary with relevant photos, Arabic voice narration, and English transliteration. No account needed. Start learning today!",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName:
    "Arabic Road - Learn Arabic Online | Free Arabic Language Learning Platform",
  mobileWebApp: {
    title:
      "Arabic Road - Learn Arabic Online | Free Arabic Language Learning Platform",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [
      {
        url: "/icon.ico",
        type: "image/x-icon",
      },
    ],
  },
  // alternates: {
  //   canonical: "https://arabicroad.com/",
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full ">
      <head></head>

      <body className=" min-h-full flex flex-col justify-between items-center  w-full   bg-[url('/bg-mobile.jpg')]  md:bg-[url('/bg.jpg')] bg-cover ">
        <AuthContextProvider>
          <Navigation />
          {children}
          <Footer />
        </AuthContextProvider>


        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q9R3EYD27Y"
        />

        <Script id="google-analytics">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Q9R3EYD27Y');
  `}
        </Script>

        <Script
          async
          // defer
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></Script>
        {/* <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerpolicy="no-referrer-when-downgrade"
          />
        </noscript> */}
      </body>
    </html>
  );
}
