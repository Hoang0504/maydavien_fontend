import { handleGetDataApi } from "@/utils";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

export const getUserLogin = async (username: string, password: string) =>
  handleGetDataApi(`${API_GET_URL}/login`, undefined, "POST", {
    username,
    password,
  });
