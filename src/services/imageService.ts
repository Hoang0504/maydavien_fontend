import { handleGetDataApi } from "@/utils";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/images`;

export const uploadImages = async (
  selectedImageFile: File,
  adminToken: string
) => {
  const formData = new FormData();
  formData.append("images", selectedImageFile);

  const response = await handleGetDataApi(
    `${API_URL}/upload`,
    "POST",
    formData,
    {
      Authorization: `Bearer ${adminToken}`,
    }
  );
  if (response) {
    return response.files;
  }
  return null;
};

export const deleteImage = async (
  imageFilename: string,
  adminToken: string,
  model: string
) => {
  const url = new URL(`${API_URL}/${imageFilename}`);
  url.searchParams.append("model", model);
  const response = await handleGetDataApi(url.toString(), "DELETE", undefined, {
    Authorization: `Bearer ${adminToken}`,
  });
  if (response) {
    return response;
  }
  return null;
};
