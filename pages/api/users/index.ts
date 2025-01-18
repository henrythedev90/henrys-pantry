import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs"; // for password hashing
import clientPromise from "../../../src/app/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure that the content type is application/json
  if (req.headers["content-type"] !== "application/json") {
    return res
      .status(400)
      .json({ message: "Content-Type must be application/json" });
  }

  // Connect to the database
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  if (req.method === "POST") {
    // Destructure request body
    const { email, password, name } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    try {
      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user document
      const newUser = {
        email,
        password: hashedPassword, // store the hashed password
        name: name || "", // optional
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert user into the database
      await db.collection("users").insertOne(newUser);

      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
