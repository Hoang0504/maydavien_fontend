import { Introduce } from "@/models/Introduce";
import { ApiResponse } from "@/models/ApiResponse";
import { fetcher } from "./api";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/introduces`;

export const getIntroduces = async (): Promise<ApiResponse<Introduce[]>> => {
  const data = await fetcher(API_GET_URL);
  return data;
};
