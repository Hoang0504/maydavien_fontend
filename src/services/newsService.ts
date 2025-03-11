import { handleGetDataApi } from "@/utils";
import ApiGetQuery from "@/models/ApiGetQuery";

const API_GET_5_LATEST_NEWS = `${process.env.NEXT_PUBLIC_API_URL}/news?latest="true"`;
const API_GET_NEWS = `${process.env.NEXT_PUBLIC_API_URL}/news`;

// : Promise<ApiResponse<News[]>>
export const getLatestNews = async () =>
  handleGetDataApi(API_GET_5_LATEST_NEWS);

export const getNews = async (query: ApiGetQuery) => {
  const url = new URL(API_GET_NEWS);

  if (query.mode === "inactive") {
    url.searchParams.append("mode", query.mode);
  }

  if (query.page) url.searchParams.append("page", query.page.toString());
  if (query.pageSize)
    url.searchParams.append("pageSize", query.pageSize.toString());
  if (query.search) url.searchParams.append("search", query.search);

  const data = await handleGetDataApi(url.toString());
  return data;
};

export const getNewsById = async (id: number) =>
  handleGetDataApi(`${API_GET_NEWS}/${id}`);

export const getNewsBySlug = async (slug: string) =>
  handleGetDataApi(`${API_GET_NEWS}/slug/${slug}`);
