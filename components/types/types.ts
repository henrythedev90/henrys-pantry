
import { ObjectId } from "mongodb";


export interface PantryItem {
    _id: ObjectId;
    ownerId: ObjectId;
    apiId: number;
    name: string;
    quantity: number;
    expirationDate: Date | null;
    createdAt: Date;
    image: string;
    aisle: string;
  }

export interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    image: string;
    recipes: Recipe[];
    pantry: PantryItem[];
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface Recipe {
    _id: ObjectId;
    userId: ObjectId;
    originalId: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    image: string;
    summary: string;
    instructions: string;
    ingredients: Ingredient[];
    cuisines: string[];
    diets: string[];
    dishTypes: string[];
  }