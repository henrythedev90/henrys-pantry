import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authenticate";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface PantryItem {
  _id: ObjectId;
  ownerId: ObjectId;
  apiId: number;
  name: string;
  quantity: number;
  expirationDate: Date | null;
  createdAt: Date;
  image: string | null;
  aisle: string;
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

        // Check if the ingredient exists in the foodItems collection
        const existingFoodItem = await db
          .collection("foodItems")
          .findOne({ name });

        let image, aisle, nutrition, apiId;

        // Function to extract nutrition from API data
        const extractNutrition = (ingredientDetailsFromAPI: any) => {
          return ingredientDetailsFromAPI.nutrition
            ? {
                nutritions: ingredientDetailsFromAPI.nutrition.nutrients.map(
                  (nutrient: any) => ({
                    name: nutrient.name,
                    amount: nutrient.amount,
                    unit: nutrient.unit,
                    percentOfDailyNeeds: nutrient.percentOfDailyNeeds || 0,
                  })
                ),
                properties: ingredientDetailsFromAPI.nutrition.properties.map(
                  (property: any) => ({
                    name: property.name,
                    amount: property.amount,
                    unit: property.unit,
                  })
                ),
                caloricBreakdown: {
                  percentProtein:
                    ingredientDetailsFromAPI.nutrition.caloricBreakdown
                      .percentProtein || 0,
                  percentFat:
                    ingredientDetailsFromAPI.nutrition.caloricBreakdown
                      .percentFat || 0,
                  percentCarbs:
                    ingredientDetailsFromAPI.nutrition.caloricBreakdown
                      .percentCarbs || 0,
                },
                weightPerServing: {
                  amount:
                    ingredientDetailsFromAPI.nutrition.weightPerServing
                      .amount || 0,
                  unit:
                    ingredientDetailsFromAPI.nutrition.weightPerServing.unit ||
                    "g",
                },
                categoryPath: ingredientDetailsFromAPI.categoryPath || [""],
              }
            : null;
        };

        if (existingFoodItem) {
          // If the item exists in the foodItems collection, use its details
          image = existingFoodItem.image;
          aisle = existingFoodItem.aisle;
          apiId = existingFoodItem.apiId;
          nutrition = existingFoodItem.nutrition;

          // If nutrition is missing, fetch it from Spoonacular API
          if (!nutrition) {
            const spoonacularDetail = await fetch(
              `https://api.spoonacular.com/food/ingredients/${apiId}/information?amount=1&apiKey=${process.env.SPOONACULAR_API_KEY}`
            );
            console.log(spoonacularDetail);
            const ingredientDetailsFromAPI = await spoonacularDetail.json();
            nutrition = extractNutrition(ingredientDetailsFromAPI);
          }
        } else {
          // If the food item doesn't exist, fetch details from Spoonacular API
          const spoonacularSearch = await fetch(
            `https://api.spoonacular.com/food/ingredients/search?query=${name}&apiKey=${process.env.SPOONACULAR_API_KEY}`
          );
          const spoonacularSearchData = await spoonacularSearch.json();
          const ingredient = spoonacularSearchData.results[0] || {};

          if (!ingredient.id) {
            return res.status(404).json({ message: "Ingredient not found" });
          }

          // Fetch detailed ingredient information using API ID
          apiId = ingredient.id;
          const spoonacularDetail = await fetch(
            `https://api.spoonacular.com/food/ingredients/${apiId}/information?amount=1&apiKey=${process.env.SPOONACULAR_API_KEY}`
          );
          const ingredientDetailsFromAPI = await spoonacularDetail.json();

          image = ingredient.image
            ? `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
            : null;
          aisle = ingredientDetailsFromAPI.aisle || "Unknown";
          nutrition = extractNutrition(ingredientDetailsFromAPI);
        }

        // Update or add the item in the pantry array (no nutrition in users collection)
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
              updatedAt: new Date(),
            },
          }
        );

        // If the item doesn't exist in the pantry, insert it as a new entry
        if (result.modifiedCount === 0) {
          const newItem: PantryItem = {
            _id: new ObjectId(),
            ownerId: userObjectId,
            name,
            quantity,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            image,
            apiId,
            aisle,
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
        }

        // Update or insert the item in the foodItems collection (with nutrition info)
        const existingItem = await db
          .collection("foodItems")
          .findOne({ name: name });

        if (existingItem) {
          // If item exists, increment submissionCount and update details
          await db.collection("foodItems").updateOne(
            { name: name },
            {
              $set: {
                name: name,
                image: image,
                nutrition: nutrition,
                aisle: aisle,
                apiId: apiId,
                submissionCount: existingItem.submissionCount + 1,
                fetchedAt: new Date(),
              },
            }
          );
        } else {
          // If item does not exist, insert it with nutrition info and submissionCount = 1
          await db.collection("foodItems").insertOne({
            name: name,
            image: image,
            nutrition: nutrition,
            aisle: aisle,
            fetchedAt: new Date(),
            submissionCount: 1,
            apiId: apiId,
          });
        }

        res.status(201).json({
          message: "Pantry updated successfully",
        });
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
