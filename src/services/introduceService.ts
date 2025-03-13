import { handleGetDataApi } from "@/utils";
import { Introduce } from "@/models/Introduce";
import { ApiGetQuery } from "@/interfaces";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/introduces`;

export const getIntroduces = async (
  query: ApiGetQuery,
  handleAdminLogout?: () => void
) => {
  const url = new URL(API_GET_URL);
  if (query.page) url.searchParams.append("page", query.page.toString());
  if (query.pageSize)
    url.searchParams.append("pageSize", query.pageSize.toString());
  if (query.search) url.searchParams.append("search", query.search);
  if (query.mode === "inactive") {
    url.searchParams.append("mode", query.mode);
  }
  return handleGetDataApi(url.toString(), handleAdminLogout);
};

export const getIntroducesById = async (id: number) =>
  handleGetDataApi(`${API_GET_URL}/${id}`);

export const getIntroduceBySlug = async (slug: string) =>
  handleGetDataApi(`${API_GET_URL}/slug/${slug}`);

export const createIntroduce = async (
  data: Introduce,
  adminToken: string,
  handleAdminLogout?: () => void
) =>
  handleGetDataApi(API_GET_URL, handleAdminLogout, "POST", data, {
    Authorization: `Bearer ${adminToken}`,
  });

export const updateIntroduce = async (
  data: Introduce,
  adminToken: string,
  handleAdminLogout?: () => void
) => {
  const { id, ...bannerData } = data;
  return handleGetDataApi(
    `${API_GET_URL}/${id}`,
    handleAdminLogout,
    "PUT",
    bannerData,
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};

export const restoreIntroduce = async (
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

export const deleteIntroduce = async (
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
