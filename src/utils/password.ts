export const hashPassword = async (password: string): Promise<string> => {
  return Bun.password.hash(password, { algorithm: "argon2id" });
};
export const verifyPassword = async (passwordToVerify: string, passwordHash: string): Promise<boolean> => {
    return Bun.password.verify(passwordToVerify, passwordHash)
};
