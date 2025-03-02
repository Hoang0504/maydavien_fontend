import { fetcher } from "./api";
import { Product } from "@/models/Product";
import { ApiResponse } from "@/models/ApiResponse";

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

  const data = await fetcher(url.toString());
  return data;
};
