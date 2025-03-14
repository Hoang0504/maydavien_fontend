import { Product } from "@/models/Product";
import { handleGetDataApi } from "@/utils";
import { ApiResponse } from "@/interfaces";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
}

export const getProducts = async (
  query: ProductQuery
): Promise<ApiResponse<Product[]>> => {
  const url = new URL(API_GET_URL);

  if (query.page) url.searchParams.append("page", query.page.toString());
  if (query.pageSize)
    url.searchParams.append("pageSize", query.pageSize.toString());
  if (query.search) url.searchParams.append("search", query.search);
  if (query.categoryId)
    url.searchParams.append("categoryId", query.categoryId.toString());

  const data = await handleGetDataApi(url.toString());
  return data;
};

export const getProductBySlug = async (slug: string) =>
  handleGetDataApi(`${API_GET_URL}/slug/${slug}`);
