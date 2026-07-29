import { type LoginInput, type SignupInput } from "./auth.validation";
import { UserModel } from "../users/user.model";
import { HttpError } from "../../errors/HttpError";
import { hashPassword, verifyPassword } from "../../utils/password";
import { signAccessToken } from "../../utils/token";

export const signup = async (input: SignupInput) => {
  const existingUser = await UserModel.exists({ email: input.email });
  if (existingUser) {
    throw new HttpError(
      409,
      "EMAIL_ALREADY_EXISTS",
      "An account with this email already exists",
    );
  }
  const passwordHash = await hashPassword(input.password);

  const userData = {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash,
  };

  const newUser = await UserModel.create(userData).catch((error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new HttpError(
        409,
        "EMAIL_ALREADY_EXISTS",
        "An account with this email already exists",
      );
    }
    throw error;
  });
  const userId = newUser._id.toString();
  const accessToken = await signAccessToken(userId);
  return {
    user: {
      id: userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
    accessToken,
  };
};

export const login = async (input: LoginInput) => {
  const { email, password } = input;
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new HttpError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
  }
  const passwordMatch = await verifyPassword(password, user.passwordHash);
  if (!passwordMatch) {
    throw new HttpError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
  }

  const accessToken = await signAccessToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
  };
};
