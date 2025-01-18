"use client";
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
      try {
        const url = `/api/recipes?ingredients=${pantryItems.join(
          ","
        )}&maxResults=5`;
        console.log(url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        console.log(data);
        debugger;
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
            <Image
              src={`${recipe.image}`}
              alt={recipe.title}
              width={200}
              height={200}
            />
            <p>Missing ingredients: {recipe.missedIngredientCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
