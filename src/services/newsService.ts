import { fetcher } from "./api";
import { ApiResponse } from "@/models/ApiResponse";
import { News } from "@/models/News";

const API_GET_5_LATEST_NEWS = `${process.env.NEXT_PUBLIC_API_URL}/news?latest="true"`;
const API_GET_NEWS = `${process.env.NEXT_PUBLIC_API_URL}/news`;

export const getLatestNews = async (): Promise<ApiResponse<News[]>> => {
  const data = await fetcher(API_GET_5_LATEST_NEWS);
  return data;
};

export async function getNews() {
  const res = await fetcher(API_GET_NEWS);
  return res.data;
}

export async function getNewsById(id: number) {
  const res = await fetcher(`${API_GET_NEWS}/${id}`);
  return res.data;
}

export async function getNewsBySlug(slug: string) {
  const res = await fetcher(`${API_GET_NEWS}/slug/${slug}`);
  return res.data;
}
