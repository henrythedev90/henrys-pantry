import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import cloudinary from "../../../lib/cloudinary";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "profile_pictures", // Optional: store in a folder
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: uploadedImage.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default authenticate(handler);
