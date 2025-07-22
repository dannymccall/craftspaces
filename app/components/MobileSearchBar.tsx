"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useMobileSearchbar } from "../context/MobileSearchbarContext";
import { useSearch } from "../context/SearchContext";
const MobileSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const {isSearchbarOpen, closeSearchbar} = useMobileSearchbar();
  const {typedQuery, setTypedQuery} = useSearch()

  // Close search when route changes
  useEffect(() => {
    closeSearchbar();
  }, [pathname]);

  // Optional: click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Search Icon (visible on mobile) */}

      {/* Sliding Search Input */}
      {isSearchbarOpen && (
        <div
          ref={containerRef}
          className="fixed top-0 left-0 w-full bg-neutral-900 px-4 py-3 z-50 shadow-xl animate-slideDown"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={typedQuery}
              onChange={(e) => setTypedQuery(e.target.value)}
              placeholder="Search for item..."
              className="w-full p-3 bg-black border border-gold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-gold"
            />
            <button
              onClick={() => {
                closeSearchbar();
                setQuery("");
                setTypedQuery("")
              }}
              className="text-gold text-xl"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Custom animation style */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
        }
      `}</style>
    </>
  );
};

export default MobileSearchBar;
