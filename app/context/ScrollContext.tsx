import { useEffect, useState, useContext, createContext } from "react";

type ScrollProps = {
  scrolled: boolean;
  showNavbar: boolean;
  setShowNavbar: (showNavbar:boolean) => void;
};

const ScrollContext = createContext<ScrollProps | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrolled, showNavbar, setShowNavbar }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context)
    throw new Error("useScroll must be used within Scroll Provider");
  return context;
};
