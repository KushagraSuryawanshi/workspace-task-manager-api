import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env";

const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);

export const signAccessToken = (userId: string): Promise<string> => {
  return new SignJWT()
    .setSubject(userId)
    .setProtectedHeader({ alg: "HS256", type: "JWT" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(jwtSecret);
};
export const verifyAccessToken = async (
  token: string,
): Promise<{ userId: string }> => {
  const { payload } = await jwtVerify(token, jwtSecret, { algorithms: ["HS256"] });

  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("Token subject is missing or invalid");
  }

  return { userId: payload.sub };
};
