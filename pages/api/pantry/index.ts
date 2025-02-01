import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface PantryItem {
  _id: ObjectId;
  userId: ObjectId;
  apiId: number;
  name: string;
  quantity: number;
  expirationDate: Date | null;
  createdAt: Date;
  image: string | null;
  aisle: string;
  nutrition: {
    nutritions: [
      {
        name: string;
        amount: number;
        unit: string;
        percentOfDailyNeeds: number;
      }
    ];
    properties: [
      {
        name: string;
        amount: number;
        unit: string;
      }
    ];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    weightPerServing: {
      amount: number;
      unit: string;
    };
    categoryPath: [string];
  };
}

async function pantryHandler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const userId = (req as any).user.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    case "GET":
      try {
        const pantry = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(userId as string) },
            { projection: { pantry: 1 } }
          );
        res.status(200).json(pantry);
      } catch (err) {
        console.error("Error fetching pantry:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    case "POST":
      try {
        const { name, quantity, expirationDate } = req.body;
        const userObjectId = new ObjectId(userId as string);

        // Fetch image and basic ingredient info
        const spoonacularSearch = await fetch(
          `https://api.spoonacular.com/food/ingredients/search?query=${name}&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const spoonacularSearchData = await spoonacularSearch.json();
        const ingredient = spoonacularSearchData.results[0] || {};

        if (!ingredient.id) {
          return res.status(404).json({ message: "Ingredient not found" });
        }

        const image = ingredient.image
          ? `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
          : null;
        const apiId = ingredient.id;

        // Fetch detailed ingredient information using API ID
        const spoonacularDetail = await fetch(
          `https://api.spoonacular.com/food/ingredients/${apiId}/information?amount=1&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const ingredientDetails = await spoonacularDetail.json();

        const aisle = ingredientDetails.aisle || "Unknown";

        // Extract nutrition details
        const nutrition = ingredientDetails.nutrition
          ? {
              nutritions: ingredientDetails.nutrition.nutrients.map(
                (nutrient: any) => ({
                  name: nutrient.name,
                  amount: nutrient.amount,
                  unit: nutrient.unit,
                  percentOfDailyNeeds: nutrient.percentOfDailyNeeds || 0,
                })
              ),
              properties: ingredientDetails.nutrition.properties.map(
                (property: any) => ({
                  name: property.name,
                  amount: property.amount,
                  unit: property.unit,
                })
              ),
              caloricBreakdown: {
                percentProtein:
                  ingredientDetails.nutrition.caloricBreakdown.percentProtein ||
                  0,
                percentFat:
                  ingredientDetails.nutrition.caloricBreakdown.percentFat || 0,
                percentCarbs:
                  ingredientDetails.nutrition.caloricBreakdown.percentCarbs ||
                  0,
              },
              weightPerServing: {
                amount:
                  ingredientDetails.nutrition.weightPerServing.amount || 0,
                unit: ingredientDetails.nutrition.weightPerServing.unit || "g",
              },
              categoryPath: ingredientDetails.categoryPath || [""],
            }
          : null;

        // Update or add the item in the pantry array
        const result = await db.collection("users").updateOne(
          { _id: userObjectId, "pantry.name": name }, // Check if item already exists
          {
            $inc: { "pantry.$.quantity": quantity }, // Increase quantity if exists
            $set: {
              "pantry.$.apiId": apiId,
              "pantry.$.expirationDate": expirationDate
                ? new Date(expirationDate)
                : null,
              "pantry.$.image": image,
              "pantry.$.aisle": aisle,
              "pantry.$.nutrition": nutrition,
              updatedAt: new Date(),
            },
          }
        );

        // If the item doesn't exist, insert it as a new entry
        if (result.modifiedCount === 0) {
          const newItem: PantryItem = {
            _id: new ObjectId(),
            userId: userObjectId,
            name,
            quantity,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            image,
            apiId,
            aisle,
            nutrition: nutrition || {
              nutritions: [],
              properties: [],
              caloricBreakdown: {
                percentProtein: 0,
                percentFat: 0,
                percentCarbs: 0,
              },
              weightPerServing: { amount: 0, unit: "g" },
              categoryPath: [""],
            },
            createdAt: new Date(),
          };

          await db.collection("users").updateOne(
            { _id: userObjectId },
            {
              $push: { pantry: newItem },
              $set: { updatedAt: new Date() },
            },
            { upsert: true }
          );

          // Update `foodItems` with correct aisle and submission count
          await db.collection("foodItems").updateOne(
            { name: newItem.name }, // Ensure unique names
            {
              $set: {
                name: newItem.name,
                image: newItem.image,
                nutrition: newItem.nutrition,
                aisle: newItem.aisle,
                fetchedAt: new Date(),
              },
              $inc: { submissionCount: 1 }, // Track submission count
            },
            { upsert: true }
          );
        }

        res.status(201).json({ message: "Pantry updated successfully" });
      } catch (err) {
        console.error("Error updating pantry:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      break;
  }
}

export default authenticate(pantryHandler);
