import { Banner } from "@/models/Banner";
import { handleGetDataApi } from "@/utils";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/banners`;

export const getBanners = async (mode: string = "active") => {
  const url = new URL(API_GET_URL);
  if (mode === "inactive") {
    url.searchParams.append("mode", mode);
  }
  return handleGetDataApi(url.toString());
};
export const createBanner = async (data: Banner, adminToken: string) =>
  handleGetDataApi(API_GET_URL, "POST", data, {
    Authorization: `Bearer ${adminToken}`,
  });
export const updateBanner = async (data: Banner, adminToken: string) => {
  const { id, ...bannerData } = data;
  return handleGetDataApi(`${API_GET_URL}/${id}`, "PUT", bannerData, {
    Authorization: `Bearer ${adminToken}`,
  });
};
export const deleteBanner = async (
  bannerId: number,
  adminToken: string,
  mode: string = ""
) => {
  const url = new URL(`${API_GET_URL}/${bannerId}`);
  if (mode === "delete-force") {
    url.searchParams.append("mode", mode);
  }
  return handleGetDataApi(
    url.toString(),
    "DELETE",
    {},
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
};
