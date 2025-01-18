"use client";
import { useState } from "react";
import RecipeForm from "./RecipeForm/RecipeForm";
import Image from "next/image";
import Link from "next/link";

interface Recipe {
  id: number;
  title: string;
  image: string;
  missedIngredientCount: number;
}

export default function RecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = async (
    ingredients: string[],
    maxResults: number
  ) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/recipes?ingredients=${ingredients.join(
          ","
        )}&maxResults=${maxResults}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Recipes</h1>
      {loading && <p>Loading recipes...</p>}
      <RecipeForm onSubmit={handleFormSubmit} />
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
            <Link href={`/recipe/${recipe.id}`}>
              <p className="text-indigo-600 hover:underline">View Details</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
