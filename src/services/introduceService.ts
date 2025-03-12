import { handleGetDataApi } from "@/utils";
import { Introduce } from "@/models/Introduce";
import { ApiResponse } from "@/interfaces";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/introduces`;

export const getIntroduces = async (): Promise<ApiResponse<Introduce[]>> =>
  handleGetDataApi(API_GET_URL);
