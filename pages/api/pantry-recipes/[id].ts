import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";

export default authenticate(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
    switch (req.method) {
      case "GET":
        try {
          const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
          );
          //   const recipe = await response.json();
          const recipeData = await response.json();
          if (!recipeData) {
            throw new Error("No recipe data found");
          }
          const recipe = {
            id: recipeData.id,
            title: recipeData.title,
            readyInMinutes: recipeData.readyInMinutes,
            servings: recipeData.servings,
            image: recipeData.image,
            imageType: recipeData.imageType,
            summary: recipeData.summary,
            instructions: recipeData.instructions,
            ingredients: recipeData.extendedIngredients,
            cuisines: recipeData.cuisines,
            diets: recipeData.diets,
            dishTypes: recipeData.dishTypes,
            extendedIngredients: recipeData.extendedIngredients,
          };

          if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
          }

          res.status(200).json(recipe);
        } catch (err) {
          console.error("Error fetching recipe:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
    }
  }
);
