"use client";

import { useState } from "react";
import classNames from "classnames/bind";

import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

export default function Header() {
  const tailwindHeaderClass =
    "flex items-center justify-between bg-white shadow-md fixed top-0 left-0 w-full z-50";
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="text-xl font-bold text-blue-900">NHẬT ANH LOGO</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-orange-600 font-semibold">
          <a href="#" className="border-b-2 border-orange-600 pb-1">
            Trang chủ
          </a>
          <a href="#">Giới thiệu</a>
          <a href="#">Khám phá</a>
          <a href="#">Thông số kỹ thuật</a>
          <a href="#">Sản phẩm</a>
          <a href="#">Hỗ trợ</a>
        </nav>

        {/* Search Icon & Mobile Menu Button */}
        <div className="flex items-center text-red-600 space-x-4">
          <a className="hidden md:flex font-semibold" href="#">
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
            className="md:hidden text-xl text-gray-600"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white text-orange-600 font-semibold border-t border-gray-200">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <a
                href="#"
                className="block py-2 px-4 border-b border-orange-600"
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4">
                Khám phá
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4">
                Thông số kỹ thuật
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4">
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4">
                Hỗ trợ
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4">
                Hotline: 1900 17 72
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
