import { handleGetDataApi } from "@/utils";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const getCategories = async () => handleGetDataApi(API_GET_URL);

export const getCategoriesById = async (id: number) =>
  handleGetDataApi(`${API_GET_URL}/${id}`);

export const getCategoryBySlug = async (slug: string) =>
  handleGetDataApi(`${API_GET_URL}/slug/${slug}`);
