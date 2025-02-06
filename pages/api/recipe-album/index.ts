import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { authenticate } from "../../../middleware/authenticate";
import { ObjectId } from "mongodb";
import { Ingredient, Recipe } from "../../../components/types/types";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = (req as any).user.id;
  const { id } = req.query;

  switch (req.method) {
    case "POST":
      try {
        // Validate the query parameter
        if (!id) {
          return res.status(400).json({ message: "Recipe ID is required." });
        }

        // Fetch recipe data from Spoonacular API
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
        );
        const recipeData = await response.json();

        if (!recipeData || !recipeData.id) {
          return res
            .status(404)
            .json({ message: "Recipe not found on Spoonacular." });
        }

        // Build the recipe object
        const recipe: Recipe = {
          _id: new ObjectId(),
          userId: new ObjectId(userId as string),
          originalId: recipeData.id,
          title: recipeData.title,
          readyInMinutes: recipeData.readyInMinutes,
          servings: recipeData.servings,
          image: recipeData.image,
          summary: recipeData.summary,
          instructions: recipeData.instructions,
          ingredients: recipeData.extendedIngredients.map((ing: any): Ingredient => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          })),
          cuisines: recipeData.cuisines,
          diets: recipeData.diets,
          dishTypes: recipeData.dishTypes,
        };

        // Check if the user exists
        const isIdValid = await db.collection("users").findOne({
          _id: new ObjectId(userId as string),
        });

        if (!isIdValid) {
          return res.status(404).json({ message: "User not found." });
        }

        // Check if the recipe is already in the user's album
        const recipeExists = await db.collection("users").findOne({
          _id: new ObjectId(userId as string),
          recipes: { $elemMatch: { originalId: recipe.originalId } },
        });

        if (recipeExists) {
          return res
            .status(400)
            .json({ message: "Recipe already in your album." });
        }

        // Add the recipe to the user's album
        const result = await db.collection("users").updateOne(
          { _id: new ObjectId(userId as string) },
          {
            $push: {
              "recipes": recipe as any,
            },
            $set: { updatedAt: new Date() },
          },
          { upsert: true }
        );

        await db.collection("cachedRecipes").updateOne(
          { _id: recipe._id },
          {
            $set: { ...recipe, fetchedAt: new Date() },
            $inc: { count: 1 },
          },
          { upsert: true }
        );

        res
          .status(201)
          .json({ message: "Recipe added to your album.", result });
      } catch (err) {
        console.error("Error adding recipe to album:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;

    case "GET":
      try {
        const userRecipes = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(userId as string) },
            { projection: { recipes: 1 } }
          );

        if (!userRecipes) {
          return res
            .status(404)
            .json({ message: "No recipes found for this user." });
        }

        res.status(200).json({
          message: "Recipes fetched successfully",
          recipes: userRecipes.recipes,
        });
      } catch (err) {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed.` });
      break;
  }
};

export default authenticate(handle);
