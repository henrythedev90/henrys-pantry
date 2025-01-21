import { NextApiRequest, NextApiResponse } from "next";
import { authenticateMiddleWare } from "../../../middlewares/authMiddleware";

async function protectedHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;
  res.status(200).json({ message: "Access granted!", user });
}

export default authenticateMiddleWare(protectedHandler);
