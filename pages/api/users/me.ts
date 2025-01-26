import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../src/app/lib/mongodb";
import { ObjectId } from "mongodb";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = (req as any).user.id;

  if (req.method === "GET") {
    try {
      const user = await db
        .collection("users")
        .findOne(
          { _id: new ObjectId(userId) },
          { projection: { password: 0 } }
        );
      res
        .status(200)
        .json({ user, message: "User profile fetched successfully" });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default authenticate(handler);
