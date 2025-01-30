import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../../lib/cloudinary";
import multer from "multer"; // Ensure multer is installed and imported correctly
import clientPromise from "../../../lib/mongodb";
import stream from "stream";
import { authenticate } from "../../../middleware/authenticate";

const upload = multer({ storage: multer.memoryStorage() });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // Parse the incoming file using multer
      await new Promise<void>((resolve, reject) => {
        upload.single("profile_pictures")(req, res, (err: any) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
      const file = req?.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload the file to Cloudinary
      cloudinary.uploader
        .upload_stream(
          { folder: "profile_pictures" },
          async (error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              return res
                .status(500)
                .json({ error: "Cloudinary upload failed" });
            }

            // Save the image URL to MongoDB
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB);
            const userId = req.body.userId; // Replace with the authenticated user's ID
            await db
              .collection("users")
              .updateOne(
                { _id: userId },
                { $set: { image: result?.secure_url } }
              );

            res.status(200).json({
              message: "Upload successful",
              imageUrl: result?.secure_url,
            });
          }
        )
        .end(file.buffer);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};

// Disable body parsing to handle multipart data with multer
export const config = {
  api: {
    bodyParser: false,
  },
};

export default authenticate(handler);
