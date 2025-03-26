"use client";

import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ZaloIcon } from "@/components/icon";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Kiểm tra vị trí cuộn để hiển thị nút "Back to Top"
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cx(
        "flex items-center justify-center bg-red-600 text-white text-center fixed left-0 right-0 bottom-0 z-50 font-bold py-2",
        "footer"
      )}
    >
      <span>HOTLINE 24/7 |</span>
      <a href="tel:0989981973" className="ml-2 hover:text-green-600">
        0989.981.973 |
      </a>
      <a href="tel:0914488248" className="ml-2 hover:text-green-600">
        091.448.8248 |
      </a>
      <a
        href="https://zalo.me/0989981973"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 hover:text-green-600"
      >
        Liên hệ qua Zalo
      </a>

      {/* Floating Zalo Button */}
      {showBackToTop && (
        <motion.a
          href="https://zalo.me/0989981973"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-32 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-400 transition-all"
          animate={{ rotate: [0, 180, -180, 180, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ZaloIcon />
        </motion.a>
      )}

      {/* Nút "Back to Top" */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center fixed bottom-16 right-4 bg-red-600 text-white w-[50px] h-[50px] rounded-full shadow-lg hover:bg-red-500 transition-all"
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      )}
    </div>
  );
}
