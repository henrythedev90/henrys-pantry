import RecipeSearch from "./components/RecipeSearch";
import Login from "./components/LoginForm/LoginForm";
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Recipe Finder</h1>
      <Login />
      <RecipeSearch />
    </div>
  );
}
