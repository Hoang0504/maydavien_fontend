import { Banner } from "@/models/Banner";
import { fetcher } from "./api";
import { ApiResponse } from "@/models/ApiResponse";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/banners`;

export const getBanners = async (): Promise<ApiResponse<Banner[]>> => {
  const data = await fetcher(API_GET_URL);
  return data;
};
