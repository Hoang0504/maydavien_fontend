"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames/bind";

import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import headerRoutes from "./headerRoutes";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

export default function Header() {
  const tailwindHeaderClass =
    "flex items-center justify-between bg-white shadow-md fixed top-0 left-0 w-full z-50 px-4";
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cx("header-wrapper", {
        [tailwindHeaderClass]: tailwindHeaderClass,
      })}
    >
      <div
        className={cx("header", {
          "mx-auto flex items-center justify-between": true,
        })}
      >
        {/* Logo */}
        <Link
          href={headerRoutes.home.href}
          className="flex items-center text-xl font-bold text-blue-900"
        >
          NHẬT ANH
          <Image
            src="/logo.jpg"
            width={50}
            height={50}
            alt="Logo"
            className="ml-2"
          />
        </Link>

        <nav
          className={`md:flex text-orange-600 font-semibold transition-all duration-300 ${
            menuOpen
              ? "fixed top-0 left-0 right-0 max-h-1/2 overflow-y-auto bg-white z-1 flex flex-col shadow-lg"
              : "md:space-x-6 hidden"
          }`}
        >
          {Object.keys(headerRoutes).map((route) => (
            <Link
              key={route}
              href={headerRoutes[route].href}
              className={`relative pb-1 transition-all duration-300 ${
                pathname === headerRoutes[route].href
                  ? "border-b-2 border-orange-600"
                  : "hover:border-b-2 hover:border-orange-600"
              } ${menuOpen ? "mx-3 py-3" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {headerRoutes[route].label}
            </Link>
          ))}
        </nav>

        {/* Search Icon & Mobile Menu Button */}
        <div className="flex items-center text-red-600 space-x-4">
          <a className="hidden md:flex font-semibold" href="tel:0914488248">
            Hotline: 0914488248
          </a>
          {/* Search Icon */}
          {/* <FontAwesomeIcon
            icon={faSearch}
            className="text-xl text-gray-600 cursor-pointer"
          /> */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden text-xl text-gray-600 ${
              menuOpen
                ? "fixed top-[2px] right-[12px] w-[36px] h-[36px] bg-white border border-solid z-2"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
    </header>
  );
}
