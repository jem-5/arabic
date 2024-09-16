import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-2 bg-base-100 opacity-80 ">
      <div>
        <p className="flex p-0 gap-8">
          <Link href="/">Home</Link>

          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </p>
        <p>
          Copyright © 2024 <Link href="/">ArabicRoad</Link>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
