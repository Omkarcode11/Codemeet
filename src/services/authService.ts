import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { AppError } from "../middleware/error/AppError";

const signToken = (id: number) => {
  return jwt.sign(
    { id },
    (process.env.JWT_SECRET as string) || "fallback_secret",
    {
      expiresIn: (process.env.JWT_EXPIRES_IN as any) || "30d",
    },
  );
};

export class AuthService {
  static async signup(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = signToken(newUser.id);

    // Remove password from output
    const userToReturn: any = { ...newUser };
    delete userToReturn.password;

    return { user: userToReturn, token };
  }

  static async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = signToken(user.id);

    // Remove password from output
    const userToReturn: any = { ...user };
    delete userToReturn.password;

    return { user: userToReturn, token };
  }
}
