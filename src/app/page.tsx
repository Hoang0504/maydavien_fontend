import classNames from "classnames/bind";
import Banner from "@/components/Banner";
import CategoriesSection from "@/components/CategoriesSection";
import IntroduceSection from "@/components/IntroduceSection";

import styles from "./body.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx("body-content")}>
      <div className="container mx-auto">
        <Banner />
        <CategoriesSection />
      </div>
      <IntroduceSection />
    </div>
  );
}
