import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../src/app/lib/mongodb";
import { ObjectId } from "mongodb";

async function recipeAlbumHandler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = (req as any).user.id;
  const { id } = req.query;
  console.log("id:", id);
  switch (req.method) {
    case "DELETE":
      try {
        const result = await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userId as string) },
            { $pull: { recipes: { originalId: parseInt(id as string) } } }
          );
        res.status(200).json({ message: "Item deleted successfully", result });
      } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
}

export default authenticate(recipeAlbumHandler);
