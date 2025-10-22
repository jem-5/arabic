import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center  bg-base-100 opacity-80 max-w-3/4 flex flex-col gap-1">
      <p className="flex   max-[999px]:text-sm flex-col md:flex-row gap-3 md:gap-4">
        <Link href="/" className="font-bold">
          Home
        </Link>
        <Link href="/about/" className="font-bold">
          About
        </Link>
        <Link href="/contact/" className="font-bold">
          Contact
        </Link>
        <Link href="/blog/" className="font-bold">
          Blog
        </Link>
        <Link href="/dashboard/" className="font-bold">
          Lessons
        </Link>
        <Link href="/verbs/" className="font-bold">
          Verbs
        </Link>
        <Link href="/privacy/" className="font-bold">
          Privacy
        </Link>
        <Link href="/terms/" className="font-bold">
          Terms
        </Link>
      </p>
      <span>Copyright © 2025 | ArabicRoad</span>
    </footer>
  );
};
export default Footer;
