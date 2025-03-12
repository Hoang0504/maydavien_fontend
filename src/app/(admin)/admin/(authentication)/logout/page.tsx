"use client";

import { useEffect } from "react";

import { useAuthentication } from "@/context/authenticationContext";

function Login() {
  const { handleAdminLogout } = useAuthentication();

  useEffect(() => {
    handleAdminLogout();
  }, []);

  return null;
}

export default Login;
