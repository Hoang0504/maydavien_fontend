import { Product } from "@/models/Product";
import { ApiGetQuery } from "@/interfaces";
import { getMethodDataWithParameters, handleGetDataApi } from "@/utils";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export const getProducts = async (query: ApiGetQuery) =>
  getMethodDataWithParameters(query, API_GET_URL);

export const getProductBySlug = async (slug: string) =>
  handleGetDataApi(`${API_GET_URL}/slug/${slug}`);

export const createProduct = async (
  data: Product,
  adminToken: string,
  handleAdminLogout?: () => void
) =>
  handleGetDataApi(API_GET_URL, handleAdminLogout, "POST", data, {
    Authorization: `Bearer ${adminToken}`,
  });

export const updateProduct = async (
  data: Product,
  adminToken: string,
  handleAdminLogout?: () => void
) => {
  const { id, ...productData } = data;
  return handleGetDataApi(
    `${API_GET_URL}/${id}`,
    handleAdminLogout,
    "PUT",
    productData,
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};

export const restoreProduct = async (
  bannerId: number,
  adminToken: string,
  handleAdminLogout?: () => void
) => {
  return handleGetDataApi(
    `${API_GET_URL}/${bannerId}`,
    handleAdminLogout,
    "PATCH",
    {},
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};

export const deleteProduct = async (
  bannerId: number,
  adminToken: string,
  mode: string = "",
  handleAdminLogout?: () => void
) => {
  const url = new URL(`${API_GET_URL}/${bannerId}`);
  if (mode === "delete-force") {
    url.searchParams.append("mode", mode);
  }
  return handleGetDataApi(
    url.toString(),
    handleAdminLogout,
    "DELETE",
    {},
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};
