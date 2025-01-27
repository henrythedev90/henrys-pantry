import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Define the shape of the decoded token for type safety
interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;

  // Add other properties as per your token's structure
}

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    try {
      // Ensure JWT_SECRET is defined
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      // Verify the token and decode its payload
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      // Attach the decoded user information to the request object
      (req as any).user = decoded;
      console.log("decoded:", decoded);
      // Call the original handler with the request and response objects
      return handler(req, res);
    } catch (err) {
      console.error("JWT verification failed:", err);

      // Add more specific error handling
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }

      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
}
