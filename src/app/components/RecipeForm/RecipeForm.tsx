import { useState } from "react";

interface RecipeFormProps {
  onSubmit: (ingredients: string[], maxResults: number) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [maxResults, setMaxResults] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert ingredients input into an array
    const ingredientList = ingredients.split(",").map((item) => item.trim());

    if (ingredientList.length === 0) {
      alert("Please enter at least one ingredient.");
      return;
    }

    // Pass the parameters to the parent component
    onSubmit(ingredientList, maxResults);
    setIngredients("");
    setMaxResults(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="ingredients"
          className="block text-sm font-medium text-gray-700"
        >
          Ingredients (comma-separated)
        </label>
        <input
          type="text"
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., tomato, cheese, basil"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="maxResults"
          className="block text-sm font-medium text-gray-700"
        >
          Max Results
        </label>
        <select
          id="maxResults"
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {Array.from({ length: 10 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Search Recipes
      </button>
    </form>
  );
};

export default RecipeForm;
