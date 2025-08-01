import "server-only";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import CryptoJS from "crypto-js";
const secretKey = process.env.SESSION_SECRET;

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  const user:any = payload.user;

  const safePayload = {
    id: user?.id, // convert ObjectId to string
    email: user?.email,
    role: user.role,
    name: user.name,
    expiresAt: payload?.expiresAt // convert Date to string
  };
  return new SignJWT(safePayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: any | undefined) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

const _secretKey: string | any = process.env.NEXT_PUBLIC_ASYNC_KEY; // Use a strong, unique key

export const encryptData = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), _secretKey).toString();
};

export const decryptData = <T>(cipherText: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, _secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};
