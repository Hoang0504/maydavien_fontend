import classNames from "classnames/bind";
import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

export default function Footer() {
  return (
    <div
      className={cx(
        "bg-red-600 text-white text-center fixed left-0 right-0 bottom-0 z-50 font-bold",
        "footer"
      )}
    >
      <span className="">HOTLINE 24/7 |</span>{" "}
      <a href="tel:0989981973" className="hover:text-green-600">
        0989.981.973
      </a>{" "}
      |{" "}
      <a href="tel:0914488248" className="hover:text-green-600">
        091.448.8248
      </a>
    </div>
  );
}
