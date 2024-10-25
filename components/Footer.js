import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-2 bg-base-100 opacity-80 ">
      <div>
        <p className="flex p-0 gap-8 max-[999px]:text-sm max-[999px]:gap-2">
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
          <Link href="/privacy/" className="font-bold">
            Privacy
          </Link>
          <Link href="/terms/" className="font-bold">
            Terms
          </Link>
        </p>
        <p>
          Copyright © 2024{" "}
          <Link href="/" className="font-bold">
            ArabicRoad
          </Link>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
