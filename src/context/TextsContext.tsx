import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useGetPageTextsQuery } from "../services/api";
import { CompareLocaldata } from "../helpers/CompareLocaldata";

type TextsMap = Record<string, { text: string; file?: string }>;

interface TextsContextValue {
  texts: TextsMap;
  t: (key: string) => string;
  getFile: (key: string) => string | undefined;
  loading: boolean;
  error: string | null;
}

const TextsContext = createContext<TextsContextValue | undefined>(undefined);

export const TextsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = useGetPageTextsQuery();

  // Инициализация из localStorage
  const localData = localStorage.getItem('pageTexts') || '{}';
  const [texts, setTexts] = useState<TextsMap>(() => {
    try {
      return JSON.parse(localData);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (data?.results) {
      // Преобразуем results в TextsMap
      const newMap: TextsMap = {};
      data.results.forEach((item) => {
        newMap[item.key] = { text: item.text, file: item.file };
      });
      // Сравниваем и обновляем localStorage и state
      CompareLocaldata({
        oldData: localData,
        newData: newMap,
        localKey: 'pageTexts',
        setState: (d) => setTexts(typeof d === 'object' && d !== null ? d : {}),
      });
    }
    // eslint-disable-next-line
  }, [data]);

  const t = (key: string) => texts[key]?.text || "";
  const getFile = (key: string) => texts[key]?.file;

  return (
    <TextsContext.Provider value={{ texts, t, getFile, loading: isLoading, error: error ? String(error) : null }}>
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
