import { News } from "@/models/News";
import { ApiGetQuery, ApiResponse } from "@/interfaces";
import { getMethodDataWithParameters, handleGetDataApi } from "@/utils";

const API_GET_5_LATEST_NEWS = `${process.env.NEXT_PUBLIC_API_URL}/news?latest="true"`;
const API_GET_NEWS = `${process.env.NEXT_PUBLIC_API_URL}/news`;

//
export const getLatestNews = async (): Promise<ApiResponse<News[]>> =>
  handleGetDataApi(API_GET_5_LATEST_NEWS);

export const getNews = async (query: ApiGetQuery) =>
  getMethodDataWithParameters(query, API_GET_NEWS);

export const getNewsById = async (id: number) =>
  handleGetDataApi(`${API_GET_NEWS}/${id}`);

export const getNewsBySlug = async (slug: string) =>
  handleGetDataApi(`${API_GET_NEWS}/slug/${slug}`);

export const createNews = async (
  data: News,
  adminToken: string,
  handleAdminLogout?: () => void
) =>
  handleGetDataApi(API_GET_NEWS, handleAdminLogout, "POST", data, {
    Authorization: `Bearer ${adminToken}`,
  });

export const updateNews = async (
  data: News,
  adminToken: string,
  handleAdminLogout?: () => void
) => {
  const { id, ...bannerData } = data;
  return handleGetDataApi(
    `${API_GET_NEWS}/${id}`,
    handleAdminLogout,
    "PUT",
    bannerData,
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};

export const restoreNews = async (
  bannerId: number,
  adminToken: string,
  handleAdminLogout?: () => void
) => {
  return handleGetDataApi(
    `${API_GET_NEWS}/${bannerId}`,
    handleAdminLogout,
    "PATCH",
    {},
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};

export const deleteNews = async (
  bannerId: number,
  adminToken: string,
  mode: string = "",
  handleAdminLogout?: () => void
) => {
  const url = new URL(`${API_GET_NEWS}/${bannerId}`);
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
