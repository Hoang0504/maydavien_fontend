import { fetcher } from "./api";
import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const data = await fetcher(API_GET_URL);
  return data;
};
