import { Schema, model, models } from "mongoose";

const RecipeSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
});

const PantryItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    recipes: { type: [RecipeSchema], default: [] },
    pantry: { type: [PantryItemSchema], default: [] },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
