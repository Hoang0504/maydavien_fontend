import axios, { AxiosRequestConfig } from "axios";

export const normalizeObject = <T extends Record<string, unknown>>(
  arr: T[]
): T[] =>
  arr.map(
    (obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (typeof value === "string") {
            try {
              return [key, decodeURIComponent(value)];
            } catch {
              return [key, value];
            }
          } else if (Array.isArray(value)) {
            return [
              key,
              value.map((item) =>
                typeof item === "string" ? decodeURIComponent(item) : item
              ),
            ];
          } else if (typeof value === "object" && value !== null) {
            return [
              key,
              normalizeObject(value as Record<string, unknown>[])[0],
            ];
          }
          return [key, value];
        })
      ) as T
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

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const encodeString = (str: string) => encodeURIComponent(str.trim());
