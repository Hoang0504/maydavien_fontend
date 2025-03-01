import axios from "axios";

export const fetcher = async (url: string) => {
    const response = await axios(url);
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.data;
  };
  