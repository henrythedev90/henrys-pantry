// import { NextApiRequest, NextApiResponse } from "next";
// import { authenticate } from "../../../middleware/authenticate";
// import clientPromise from "../../../src/app/lib/mongodb";
// import { ObjectId } from "mongodb";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const client = await clientPromise;
//   const db = client.db(process.env.MONGODB_DB);
//   const userId = (req as any).user.id;

//   switch (req.method) {
//     // case "POST":
//     //   try {
//     //     const { title, ingredients, instructions } = req.body;

//     //     if (!title || !ingredients || !instructions) {
//     //       return res.status(400).json({ message: "Missing required fields" });
//     //     }

//     //     const newRecipe = {
//     //       _id: new ObjectId(),
//     //       title,
//     //       ingredients,
//     //       instructions,
//     //       createdAt: new Date(),
//     //     };

//     //     const result = await db
//     //       .collection("users")
//     //       .updateOne(
//     //         { _id: new ObjectId(userId as string) },
//     //         { $push: { recipes: newRecipe }, $set: { updatedAt: new Date() } }
//     //       );

//     //     res
//     //       .status(201)
//     //       .json({ message: "Recipe added successfully", newRecipe });
//     //   } catch (error) {
//     //     console.error("Error adding recipe:", error);
//     //     res.status(500).json({ message: "Internal Server Error" });
//     //   }
//     //   break;

//     case "GET":
//       try {
//         const maxResults = req.query.maxResults || 10;

//         const user = await db
//           .collection("users")
//           .findOne({ _id: new ObjectId(userId as string) });
//         const ingredients =
//           user?.pantry?.map((item: any) => item.name).join(",") || "";

//         if (!ingredients) {
//           return res
//             .status(400)
//             .json({ message: "No ingredients found in pantry." });
//         }

//         const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${maxResults}&apiKey=${process.env.SPOONACULAR_API_KEY}`;

//         const spoonacularResponse = await fetch(spoonacularUrl);

//         if (!spoonacularResponse.ok) {
//           console.error(
//             "Error from Spoonacular API:",
//             await spoonacularResponse.text()
//           );
//           return res
//             .status(spoonacularResponse.status)
//             .json({ message: "Failed to fetch recipes from Spoonacular API." });
//         }

//         const recipes = await spoonacularResponse.json();

//         res.status(200).json(recipes);
//       } catch (error) {
//         console.error("Error fetching recipes:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//       }
//       break;

//     default:
//       res.setHeader("Allow", ["POST", "GET"]);
//       res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//       break;
//   }
// };

// export default authenticate(handler);
