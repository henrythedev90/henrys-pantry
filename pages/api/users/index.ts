import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/app/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (req.method === "GET") {
    // Retrieve all users (admin use case)
    try {
      const users = await db
        .collection("users")
        .find({}, { projection: { password: 0 } })
        .toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    // Create a new user
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    try {
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        email,
        password: hashedPassword,
        name: name || "",
        recipes: [],
        pantry: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("users").insertOne(newUser);
      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
