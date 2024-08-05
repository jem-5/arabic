import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-2 bg-base-300 text-base-content">
      <aside>
        <p>
          Copyright © 2024 ArabicRoad.com |{" "}
          <Link href="/privacy">Privacy Policy</Link>
        </p>
      </aside>
    </footer>
  );
};
export default Footer;
