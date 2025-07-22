"use client"

import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "../lib/types/User";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void; // ✅ Add function to update user
  createSession: (userData: User) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await localStorage.getItem("userData");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error retrieving session:", error);
      } finally {
        setLoading(false); // Stop loading once user is retrieved
      }
    })();
  }, []);

  const login = async (userData: User) => {
    await localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await localStorage.removeItem("userData");
    setUser(null);
  };

  const createSession =async (userData: User) => {
    sessionStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  }

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("userData", JSON.stringify(newUser)); // ✅ Save to localStorage
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, createSession }}>
      {!loading && children} {/* Ensure UI only renders after loading */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
