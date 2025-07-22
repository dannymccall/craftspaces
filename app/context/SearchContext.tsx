// context/SearchContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SearchContextType = {
  searchQuery: string;
  typedQuery: string
  setTypedQuery: (query: string) => void;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
const [typedQuery, setTypedQuery] = useState("");
const [category, setCategory] = useState("");

  return (
    <SearchContext.Provider value={{typedQuery, searchQuery, setSearchQuery, setTypedQuery, category, setCategory }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};