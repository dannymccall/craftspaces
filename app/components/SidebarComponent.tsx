import React from "react";

interface SidebarComponentProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const SidebarComponent = ({
  children,
  setIsOpen,
  isOpen,
}: SidebarComponentProps) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-50"
        />
      )}
      
      <div
        className={`fixed top-0 right-0 p-5 py-3 h-full overflow-y-auto bottom-0 z-50 w-full md:w-1/2 lg:w-1/3 bg-neutral-800  text-slate-200 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default SidebarComponent;
