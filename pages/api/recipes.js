import clientPromise from "../../lib/mongodb"; // Updated import path to use alias

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    if (req.method === "GET") {
      const ingredients = req.query.ingredients;
      const maxResults = req.query.maxResults || 10;

      if (!ingredients) {
        return res.status(400).json({ message: "Please add ingredients." });
      }

      const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${maxResults}&apiKey=${SPOONACULAR_API_KEY}`;

      const spoonacularResponse = await fetch(spoonacularUrl);

      if (!spoonacularResponse.ok) {
        console.error(
          "Error from Spoonacular API:",
          await spoonacularResponse.text()
        );
        return res
          .status(spoonacularResponse.status)
          .json({ message: "Failed to fetch recipes from Spoonacular API." });
      }

      const recipes = await spoonacularResponse.json();

      // console.log("Recipes fetched:", recipes); // Log the fetched recipes

      // Optionally cache recipes in MongoDB
      // This refers to the MongoDB collection where the recipes will be stored.
      await db.collection("cachedRecipes").insertMany(
        recipes.map((recipe) => ({
          ...recipe,
          fetchedAt: new Date(),
        }))
      );

      res.status(200).json(recipes);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API Error:", error); // Log the full error
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
