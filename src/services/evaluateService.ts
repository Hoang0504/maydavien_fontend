import { handleGetDataApi } from "@/utils";
import { Evaluate } from "@/models/Evaluate";
import { ApiResponse } from "@/models/ApiResponse";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/evaluates`;

export const getEvaluates = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<Evaluate[]>> => {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const url = query ? `${API_GET_URL}?${query}` : API_GET_URL;

  const data = await handleGetDataApi(url);
  return data;
};
