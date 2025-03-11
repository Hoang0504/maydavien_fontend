import { handleGetDataApi } from "@/utils";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/images`;

export const uploadImages = async (
  selectedImageFile: File,
  adminToken: string,
  handleAdminLogout?: () => void
) => {
  const formData = new FormData();
  formData.append("images", selectedImageFile);

  const response = await handleGetDataApi(
    `${API_URL}/upload`,
    handleAdminLogout,
    "POST",
    formData,
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
  return response;
};

export const deleteImage = async (
  imageFilename: string,
  adminToken: string,
  model: string,
  handleAdminLogout?: () => void
) => {
  const url = new URL(`${API_URL}/${imageFilename}`);
  url.searchParams.append("model", model);
  const response = await handleGetDataApi(
    url.toString(),
    handleAdminLogout,
    "DELETE",
    undefined,
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
  if (response) {
    return response;
  }
  return null;
};
