import RecipeSearch from "./components/RecipeSearch";
export default function Home() {
  const pantryItems = ["tomato", "cheese", "basil"];
  return (
    <div>
      <h1>Welcome to the Recipe Finder</h1>
      <RecipeSearch pantryItems={pantryItems} />
    </div>
  );
}
