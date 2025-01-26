import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { authorizeOwnResource } from "../../../middleware/authorizeOwnResourse";
// GET	/api/users/:id	Retrieve a single user
// PUT/PATCH	/api/users/:id	Update user details
// DELETE	/api/users/:id	Delete a user

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const { id } = req.query;

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const userId = new ObjectId(id as string);

  if (req.method === "GET") {
    try {
      const user = await db
        .collection("users")
        .findOne({ _id: userId }, { projection: { password: 0 } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    const { name, email } = req.body;
    const updateFields: any = { updatedAt: new Date() };

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    try {
      const result = await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: { ...updateFields, updatedAt: new Date() },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({
          message: "User updated successfully!",
          updatedUser: { ...result, ...updateFields },
        });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await db.collection("users").deleteOne({ _id: userId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User deleted successfully!", deletedUser: result });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default authorizeOwnResource(handler);
