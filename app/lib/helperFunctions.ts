import jwt from "jsonwebtoken";

export function generateSecurePassword(length: number = 12): string {
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allCharacters =
    upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;
  let password = "";

  // Ensure the password contains at least one character from each category
  password +=
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  password +=
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Fill the rest of the password length with random characters
  for (let i = password.length; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to ensure random order of characters
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

export async function makeRequest(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data)
    if (!response.ok) {
      // console.log(response);
      throw new Error(response.statusText);
    }

    return data;
  } catch (error: any) {
    // console.error("Request failed:", error.message);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to connect to the server. Please try again later.",
      },
    };
  }
}

export function generateToken(
  data: any,
  dateOfExpire: string | any,
  secret: string
) {
  return jwt.sign(data, secret!, {
    expiresIn: dateOfExpire,
  });
}

export function verify(token: string, secret: string) {
  return jwt.verify(token, secret);
}

import { jwtVerify } from "jose";

// secret must be a Uint8Array, not a string
const encoder = new TextEncoder();

export async function verifyToken(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      encoder.encode(secret) // convert secret to Uint8Array
    );
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export function generateSystemID(prefix: string): string {
  const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year

  // Generate a random 4-character alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Combine parts to create the client ID
  return `${prefix}-${year}${randomPart}`;
}

export async function blobToFile(blobType: string, imageName: string) {
  try {
    const res = await fetch(blobType, { method: "GET" });

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }

    const blob = await res.blob();

    // Extract file extension from blob type
    const extension = blob.type.split("/")[1] || "png"; // Default to png if unknown

    // Ensure the filename has the correct extension
    const finalFileName = imageName.includes(".")
      ? imageName
      : `${imageName}.${extension}`;

    const file = new File([blob], finalFileName, { type: blob.type });

    // console.log(file);
    return file;
  } catch (e: any) {
    console.log(e.message);
  }
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(value);

export function toCapitalized(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const checkEmptyString = (data: Record<string, any>): string => {
  for (const [key, value] of Object.entries(data)) {
    if (value.trim() === "") {
      return `${key} Required`;
    }
  }

  return "";
};

export function formatDate(dob: any) {
  let date = new Date(dob);

  if (date instanceof Date) {
    // Format the date as YYYY-MM-DD
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`; // Returns date in YYYY-MM-DD format
  } else {
    return "Invalid date";
  }
}

export async function fetchNotifications() {
  try {
    const response = await makeRequest(
      `/api/users/auth?service=fetchNotifications`,
      { method: "GET" }
    );
    return response;
  } catch (error: any) {}
}

export const markAsRead = async (id: number) => {
  try {
    const response = await makeRequest(`/api/users/auth?service=markAsRead`, {
      method: "PUT",
      body: JSON.stringify({notificationId: id}),
    });
    return response
  } catch (err) {
    console.error("Failed to mark as read:", err);
  }
};
