import { Evaluate } from "@/models/Evaluate";
import { ApiGetQuery } from "@/interfaces";
import { getMethodDataWithParameters, handleGetDataApi } from "@/utils";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/evaluates`;

export const getEvaluates = async (query: ApiGetQuery) =>
  getMethodDataWithParameters(query, API_GET_URL);

export const getEvaluatesById = async (id: number) =>
  handleGetDataApi(`${API_GET_URL}/${id}`);

export const createEvaluate = async (
  data: Evaluate,
  adminToken: string,
  handleAdminLogout?: () => void
) =>
  handleGetDataApi(API_GET_URL, handleAdminLogout, "POST", data, {
    Authorization: `Bearer ${adminToken}`,
  });

export const updateEvaluate = async (
  data: Evaluate,
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

export const restoreEvaluate = async (
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

export const deleteEvaluate = async (
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
