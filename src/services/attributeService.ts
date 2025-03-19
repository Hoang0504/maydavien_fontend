import { getMethodDataWithParameters } from "@/utils";
import ApiGetQuery from "@/interfaces/ApiGetQuery";

const API_GET_URL = `${process.env.NEXT_PUBLIC_API_URL}/attributes`;

export const getAttributes = async (
  query: ApiGetQuery,
  adminToken: string,
  handleAdminLogout?: () => void
) =>
  getMethodDataWithParameters(
    query,
    API_GET_URL,
    handleAdminLogout,
    adminToken
  );
