import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import axios from "axios";
import { useAuth } from "../../components/common/AuthContext";

export default function Recipes() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRecipes(res.data);
      });
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <h1>Recipes</h1>

        {/* {recipes.map((recipe) => (
          <div key={recipe.id}>{recipe.name}</div>
        ))} */}
      </div>
    </ProtectedRoute>
  );
}
