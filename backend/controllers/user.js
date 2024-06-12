import ResponseModel from "./responseModel";
import User from "../models/user";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";

export const RegisterUser = async (req, res, next) => {
  const { email, username, password } = req?.body;
  const exists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (exists) {
    const response = new ResponseModel(false, "User Already Exists.", null);
    res.status(500).json(response);
  }
  const salt = await bcrypt.genSalt(10); // create a salt and send and save it to db
  const hashPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ username, email, password: hashPassword });
  const response = new ResponseModel(true, "Successfully  created user", user);
  res.status(200).json(response);
};

export const login = async (credentials) => {
  const user = await User.findOne({
    email: { $regex: new RegExp(credentials?.email, "i") },
  });
  if (!user) {
    throw new Error("User not exists");
  }
  const isCorrect = await bcrypt.compare(credentials.password, user.password);
  if (!isCorrect) {
    throw new Error("Password incorrect");
  }
  return user;
};

export const authOptions = {
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (error) {
          console.log("Error =", error);
          throw new Error("Failed to login");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token.username = user.username),
          (token.email = user.email),
          (token.id = user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user.username = token.username),
          (session.user.email = token.email),
          (session.user.id = token.id);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const ChangePassword = async (req, res, next) => {
  const { email, newPassword, currentPassword } = req.body;

  if (!email || !newPassword || !currentPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isCorrectPassword = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCorrectPassword) {
    return res.status(401).json({ message: "Incorrect current password" });
  }

  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashPassword;
  await user.save();
  const response = new ResponseModel(true, "Password Changed successfully");
  res.status(200).json(response);
};
