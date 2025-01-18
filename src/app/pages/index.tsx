import { useEffect, useState } from "react";
import Image from "next/image";

interface RecipeSearchProps {
  pantryItems: string[];
}
interface Recipe {
  id: number;
  title: string;
  image: string;
  missedIngredientCount: number;
}

export default function RecipeSearch({ pantryItems }: RecipeSearchProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setLoading(true);
      try {
        const response = await fetch(
          `/api/recipes?ingredients=${pantryItems.join(",")}&maxResults=5`
        );
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    if (pantryItems.length > 0) {
      fetchRecipes();
    }
  }, [pantryItems]);

  return (
    <div>
      <h1>Recipes</h1>
      {loading && <p>Loading recipes...</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <Image src={recipe.image} alt={recipe.title} width={200} />
            <p>Missing ingredients: {recipe.missedIngredientCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
