import axios from "axios";

export const handleGetDataApi = async (url: string) => {
  try {
    const response = await axios(url);
    if (response.status < 200 || response.status >= 300) {
      console.error("Get data error: " + response.status);
      return null;
    }
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
    } else if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    }
    return null;
  }
};
