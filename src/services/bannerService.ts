import { handleGetDataApi } from "@/utils";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/banners`;

export const getBanners = async () => handleGetDataApi(API_GET_URL);
