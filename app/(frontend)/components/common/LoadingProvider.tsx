"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <LoadingContext.Provider
      value={{ isLoading, setLoading, showLoading, hideLoading }}
    >
      {children}
      {isLoading && <LoadingSpinner />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
