"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import { UserResponse } from "@/models/UserResponse";

type dataType = {
  token: string;
  user: UserResponse | null;
};

const AuthenticationContext = createContext({
  adminToken: "",
  adminAccount: null as UserResponse | null,
  handleAdminLogin: (data: dataType) => {},
});

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const [adminToken, setAdminToken] = useState("");
  const [adminAccount, setAdminAccount] = useState<UserResponse | null>(null);

  const handleAdminLogin = (data: dataType) => {
    setAdminToken(data.token);
    setAdminAccount(data.user);
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminAccount", JSON.stringify(data.user));
  };

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("adminToken") || "";

    const adminAccountFromLocalStorage = JSON.parse(
      localStorage.getItem("adminAccount") || "{}"
    );
    setAdminToken(tokenFromLocalStorage);
    setAdminAccount(adminAccountFromLocalStorage);
  }, []);

  return adminToken ? (
    <AuthenticationContext.Provider
      value={{ adminToken, adminAccount, handleAdminLogin }}
    >
      {children}
    </AuthenticationContext.Provider>
  ) : null;
};

export const useAuthentication = () => useContext(AuthenticationContext);
export default AuthenticationProvider;
