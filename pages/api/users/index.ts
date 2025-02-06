import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import cloudinary from "../../../lib/cloudinary";
import {User, Recipe, PantryItem} from "../../../components/types/types"

// POST	/api/users	Create a new user
// GET	/api/users	Retrieve all users (admin)

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const { email, password, firstName, lastName, image } = req.body;

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

      const newUser: User = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        image,
        recipes: [] as Recipe[],
        pantry: [] as PantryItem[],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let profilePicUrl = "";
      if (image) {
        const uploadProfilePicture = await cloudinary.uploader.upload(image, {
          folder: "profile_picture_pantryApp",
        });
        profilePicUrl = uploadProfilePicture.secure_url;
      }

      if (profilePicUrl) {
        newUser.image = profilePicUrl; // Add profilePicture to newUser object
      }

      await db.collection("users").insertOne(newUser); // Save newUser to the database
      res
        .status(201)
        .json({ message: "User created successfully!", newUser: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;
