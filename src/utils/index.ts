import axios, { AxiosRequestConfig } from "axios";

export const normalizeObject = (
  arr: Array<Record<string, unknown>>
): Array<Record<string, unknown>> =>
  arr.map((obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "string" ? decodeURIComponent(value) : value,
      ])
    )
  );

export const handleGetDataApi = async (
  url: string,
  handleAdminLogout?: () => void,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET", // Default to GET
  data?: FormData | object, // Accept FormData for images or other data types
  headers: AxiosRequestConfig["headers"] = {}
) => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
        ...headers,
      },
      data: method !== "GET" ? data : undefined,
    };

    const response = await axios(config);

    if (response.status < 200 || response.status >= 300) {
      console.error("API Error 1:", response.status);
      return response;
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || error.message;

      if (errorData.message === "The token is not valid or has expired") {
        if (handleAdminLogout) {
          handleAdminLogout();
        }
      }

      console.error("API Error 2:", errorData);
      return errorData;
    } else if (error instanceof Error) {
      console.error("API Error 3:", error.message);
      return error.message;
    }
    return {
      error: true,
      message: "An error occurred while fetching data from the API.",
    };
  }
};

export const getFilenameAndExtension = (url: string) => {
  const filename = url.split("/").pop();
  if (!filename) return "";
  return filename;
};

export const encodeString = (str: string) => encodeURIComponent(str.trim());
