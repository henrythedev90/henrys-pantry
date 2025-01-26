import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/app/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, newPassword, name } = req.body;

  if (!email || !password || !newPassword || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const existingUser = await db.collection("users").findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const updateData: { name?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12);
      console.log("New hashed password:", updateData.password);
    }
    console.log("Update data prepared:", updateData);
    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: updateData });
    console.log("Database update result:", result);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
