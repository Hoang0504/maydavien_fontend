"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

import { UserResponse } from "@/models/UserResponse";
import routes from "@/config";

type dataType = {
  token: string;
  user: UserResponse | null;
};

const AuthenticationContext = createContext({
  adminToken: "",
  adminAccount: null as UserResponse | null,
  handleAdminLogin: (data: dataType) => {},
  handleAdminLogout: () => {},
});

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [adminAccount, setAdminAccount] = useState<UserResponse | null>(null);

  const handleAdminLogin = (data: dataType) => {
    setAdminToken(data.token);
    setAdminAccount(data.user);
    localStorage.setItem("adminToken", JSON.stringify(data.token));
    localStorage.setItem("adminAccount", JSON.stringify(data.user));
    router.push(routes.admin.banner);
  };

  const handleAdminLogout = () => {
    setAdminToken("");
    setAdminAccount(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAccount");
    window.alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    router.push(routes.admin.login);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdminAccount = localStorage.getItem("adminAccount");

    const tokenFromLocalStorage =
      storedToken && storedToken !== "null" && storedToken !== "undefined"
        ? JSON.parse(storedToken)
        : null;

    const adminAccountFromLocalStorage =
      storedAdminAccount &&
      storedAdminAccount !== "null" &&
      storedAdminAccount !== "undefined"
        ? JSON.parse(storedAdminAccount)
        : null;

    if (tokenFromLocalStorage && adminAccountFromLocalStorage) {
      setAdminToken(tokenFromLocalStorage);
      setAdminAccount(adminAccountFromLocalStorage);
    }
  }, []);

  return adminToken ? (
    <AuthenticationContext.Provider
      value={{
        adminToken,
        adminAccount,
        handleAdminLogin,
        handleAdminLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  ) : null;
};

export const useAuthentication = () => useContext(AuthenticationContext);
export default AuthenticationProvider;
