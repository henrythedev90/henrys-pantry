import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

async function pantryItemHandler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = (req as any).user.id;
  const { id } = req.query;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    case "GET":
      try {
        const user = await db.collection("users").findOne(
          {
            _id: new ObjectId(userId as string),
            pantry: { $elemMatch: { _id: new ObjectId(id as string) } },
          },
          {
            projection: { "pantry.$": 1 }, // Only return the matching item in the pantry array
          }
        );

        if (!user || !user.pantry || user.pantry.length === 0) {
          return res.status(404).json({ message: "Item not found" });
        }

        const item = user.pantry[0];
        res.status(200).json({ item });
      } catch (err) {
        console.error("Error fetching pantry:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    case "PUT":
      try {
        const { name, quantity, expirationDate } = req.body;
        const updatedItem: any = { updatedAt: new Date() };

        const existingItem = await db.collection("users").findOne(
          {
            _id: new ObjectId(userId as string),
            "pantry._id": new ObjectId(id as string),
          },
          {
            projection: { "pantry.$": 1 },
          }
        );

        if (
          !existingItem ||
          !existingItem.pantry ||
          existingItem.pantry.length === 0
        ) {
          return res.status(404).json({ message: "Item not found" });
        }

        const currentItem = existingItem.pantry[0];

        updatedItem.name = name || currentItem.name;
        updatedItem.quantity = quantity || currentItem.quantity;
        updatedItem.expirationDate = expirationDate
          ? new Date(expirationDate)
          : currentItem.expirationDate;

        const result = await db.collection("users").updateOne(
          {
            _id: new ObjectId(userId as string),
            "pantry._id": new ObjectId(id as string),
          },
          {
            $set: {
              "pantry.$.name": updatedItem.name,
              "pantry.$.quantity": updatedItem.quantity,
              "pantry.$.expirationDate": updatedItem.expirationDate,
              "pantry.$.updatedAt": updatedItem.updatedAt,
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated", result });
      } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    case "DELETE":
      try {
        const result = await db.collection("users").updateOne(
          {
            "pantry._id": new ObjectId(id as string),
          },
          {
            $pull: { pantry: { _id: new ObjectId(id as string) } },
            $set: { updatedAt: new Date() },
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted", result });
      } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
}

export default authenticate(pantryItemHandler);
