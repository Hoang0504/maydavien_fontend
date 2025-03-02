import { fetcher } from "./api";
import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const data = await fetcher(API_GET_URL);
  return data;
};

export async function getCategoriesById(id: number) {
  const res = await fetcher(`${API_GET_URL}/${id}`);
  return res.data;
}

export async function getCategoryBySlug(slug: string) {
  const res = await fetcher(`${API_GET_URL}/slug/${slug}`);
  return res.data;
}
