import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../src/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET	/api/users/me	Get authenticated user profile
// PATCH	/api/users/me	Update authenticated user

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user; // User info is attached by the authenticate middleware
  res.status(200).json({
    message: "Authenticated user data retrieved successfully.",
    user, // Return the user data
  });
}

export default authenticate(handler);
