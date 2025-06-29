import React, { createContext, useContext, ReactNode } from "react";
import { useGetPageTextsQuery } from "../services/api";

type TextsMap = Record<string, string>;

interface TextsContextValue {
  texts: TextsMap;
  t: (key: string) => string;
  loading: boolean;
  error: string | null;
}

const TextsContext = createContext<TextsContextValue | undefined>(undefined);

export const TextsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = useGetPageTextsQuery();
  const texts: TextsMap = React.useMemo(() => {
    if (!data?.results) return {};
    const map: TextsMap = {};
    data.results.forEach((item) => {
      map[item.key] = item.text;
    });
    return map;
  }, [data]);

  const t = (key: string) => texts[key] || "";

  return (
    <TextsContext.Provider value={{ texts, t, loading: isLoading, error: error ? String(error) : null }}>
      {children}
    </TextsContext.Provider>
  );
};

export const useTexts = () => {
  const context = useContext(TextsContext);
  if (!context) {
    throw new Error("useTexts must be used within a TextsProvider");
  }
  return context;
};
