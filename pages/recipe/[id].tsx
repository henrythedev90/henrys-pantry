import { GetServerSideProps } from "next";
import Image from "next/image";

interface RecipeDetailProps {
  recipe: {
    id: number;
    title: string;
    image: string;
    summary: string;
    instructions: string;
    ingredients: { name: string; amount: number; unit: string }[];
  };
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  if (!recipe) {
    return <p>Recipe not found!</p>;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <Image src={recipe.image} alt={recipe.title} width={200} height={200} />
      <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <ol>
        {recipe.instructions.split("\n").map((line, index) => (
          <li key={index}>
            <p>{line}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The server-side fetching logic
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }

    const recipeData = await response.json();

    const recipe = {
      id: recipeData.id,
      title: recipeData.title,
      image: recipeData.image,
      summary: recipeData.summary,
      instructions: recipeData.instructions,
      ingredients: recipeData.extendedIngredients.map(
        (ingredient: { name: string; amount: number; unit: string }) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })
      ),
    };

    return { props: { recipe } };
  } catch (error) {
    console.error(error);

    return { props: { recipe: null } };
  }
};
