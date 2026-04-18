import prisma from "../../prisma/client";
import { comparePassword, hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";


const registerUser = async (data: any) => {
  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
    },
  });

  return user;
};

const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return { token };
};

export const authService = { registerUser, loginUser };