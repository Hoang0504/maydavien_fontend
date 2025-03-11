"use client";
import { createContext, useState, useContext, ReactNode } from "react";

const LoadingContext = createContext({
  loading: false,
  setLoading: (state: boolean) => {},
});

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
export default LoadingProvider;
