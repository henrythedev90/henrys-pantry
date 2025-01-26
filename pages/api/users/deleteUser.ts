import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/app/lib/mongodb";
import bcrypt from "bcryptjs";
async function deleteUser(
  email: string,
  password: string,
  db: any,
  res: NextApiResponse
) {
  const existingUser = await db.collection("users").findOne({ email });
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid password" });
  }

  await db.collection("users").deleteOne({ email });
  return res.status(200).json({ message: "User deleted successfully" });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return deleteUser(email, password, db, res);
}
