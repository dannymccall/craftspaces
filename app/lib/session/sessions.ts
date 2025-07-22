import "server-only";
import { cookies } from "next/headers";
import { generateToken } from "../helperFunctions";

export async function createSession(user: {email:string, id:number, role:string}, rememberMe: boolean) {
 const expiresAt = rememberMe
  ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  : new Date(Date.now() + 60 * 60 * 1000);          // 1 hour

const expires = rememberMe ? "30d" : "1h";
const session = generateToken(user, expires, process.env.NEXT_PUBLIC_JWT_SECRET!);

const cookieStore = await cookies();
cookieStore.set("session", session, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  expires: expiresAt,
  sameSite: "lax",
  path: "/",
});
}

// export async function updateSession() {
//   const session = (await cookies()).get("session")?.value;
//   const payload = decrypt(session);

//   if (!session || !payload) return null;

//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   const cookieStore = await cookies();
//   cookieStore.set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: "lax",
//     path: "/",
//   });
// }

export async function deleteSession(session: string) {
  const cookieStore = await cookies();
  cookieStore.delete(session);
}

export async function getSession(name: string){
  const session = (await cookies()).get(name)?.value;
  // console.log({session})
  return session;
}