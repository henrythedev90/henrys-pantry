import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // `Bearer token`

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    // Verify the token using the same secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // You can now access the decoded data (e.g., user ID)
    res.status(200).json({ message: "User data", user: decoded });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
