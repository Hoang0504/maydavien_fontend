import axios, { AxiosRequestConfig } from "axios";

export const handleGetDataApi = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET", // Default to GET
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
      console.error("API Error:", response.status);
      return response;
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      return error.response?.data || error.message;
    } else if (error instanceof Error) {
      console.error("API Error:", error.message);

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
