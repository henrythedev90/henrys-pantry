import clientPromise from "../../lib/mongodb";

// const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    if (req.method === "GET") {
      // Fetch recipes from Spoonacular API based on pantry items
      const ingredients = req.query.ingredients; // Expect ingredients as a query string (comma-separated)
      const maxResults = req.query.maxResults || 10;

      if (!ingredients) {
        return res
          .status(400)
          .json({ message: "Ingredients query parameter is required." });
      }

      const spoonacularResponse = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${maxResults}&apiKey=${SPOONACULAR_API_KEY}`
      );

      if (!spoonacularResponse.ok) {
        return res
          .status(spoonacularResponse.status)
          .json({ message: "Failed to fetch recipes from Spoonacular API." });
      }

      const recipes = await spoonacularResponse.json();

      // Optionally save the fetched recipes to MongoDB for caching
      await db.collection("cachedRecipes").insertMany(
        recipes.map((recipe) => ({
          ...recipe,
          fetchedAt: new Date(),
        }))
      );

      res.status(200).json(recipes);
    } else if (req.method === "POST") {
      // Add a new recipe manually to MongoDB
      const { name, ingredients } = req.body;

      if (!name || !ingredients) {
        return res
          .status(400)
          .json({ message: "Name and ingredients are required." });
      }

      const result = await db.collection("recipes").insertOne({
        name,
        ingredients,
        createdAt: new Date(),
      });

      res
        .status(201)
        .json({ message: "Recipe added!", recipeId: result.insertedId });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
