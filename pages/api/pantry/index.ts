import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../src/app/lib/mongodb";
import { ObjectId } from "mongodb";
async function pantryHandler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = (req as any).user.id;
  console.log(userId, "is this working?");

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    case "GET":
      try {
        const pantry = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(userId as string) },
            { projection: { pantry: 1 } }
          );
        res.status(200).json(pantry);
      } catch (err) {
        console.error("Error fetching pantry:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;

    case "POST":
      try {
        const { name, quantity, unit, expirationDate } = req.body;
        const newItem = {
          _id: new ObjectId(),
          userId: new ObjectId(userId as string),
          name: name as string,
          quantity: quantity as number,
          unit: unit as string,
          expirationDate: expirationDate ? new Date(expirationDate) : null,
          createdAt: new Date(),
        };

        const result = await db.collection("users").updateOne(
          { _id: new ObjectId(userId as string) }, // Match the user by their ID
          {
            $push: { pantry: newItem },
            $set: { updatedAt: new Date() },
          },
          { upsert: true } // Create the document if it doesn't exist
        );
        console.log("result:", result);
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "user not found or pantry not updated" });
        }
        res.status(201).json({ message: "Item added to pantry", result });
      } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
}

export default authenticate(pantryHandler);
