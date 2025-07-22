import React, { useState, useContext, createContext } from "react";

type MobileSearchbar = {
  isSearchbarOpen: boolean;
  openSearchbar: () => void;
  closeSearchbar: () => void;
};

const MobileSearchbarContext = createContext<MobileSearchbar | null>(null);

export const MobileSearchbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSearchbarOpen, setIsSearchbarOpen] = useState<boolean>(false);

  const closeSearchbar = () => {
    setIsSearchbarOpen(false);
  };

    const openSearchbar = () => {
    setIsSearchbarOpen(true);
  };


  return (
    <MobileSearchbarContext.Provider value={{ isSearchbarOpen, closeSearchbar, openSearchbar }}>
      {children}
    </MobileSearchbarContext.Provider>
  );
};

export const useMobileSearchbar = () => {
  const context = useContext(MobileSearchbarContext);

  if (!context)
    throw new Error(
      "useMobileSearchbar must be used within MobileSearchbarContext"
    );

  return context;
};
