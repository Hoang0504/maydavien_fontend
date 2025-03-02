import routes from "@/config";

const headerRoutes: Record<string, { href: string; label: string }> = {
  home: { href: routes.home, label: "Trang chủ" },
  introduces: { href: routes.introducesMenu, label: "Giới thiệu" },
  products: { href: routes.productsMenu, label: "Sản phẩm" },
  categories: { href: routes.categoriesMenu, label: "Danh mục" },
  news: { href: routes.news, label: "Tin Tức" },
};

export default headerRoutes;
