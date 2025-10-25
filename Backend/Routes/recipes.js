import express from "express";
import axios from "axios";
import Recipe from "../dbmodels/recipes.model.js";
import cron from "node-cron";
import { GoogleGenAI } from "@google/genai"; // check for working of Ai , let research about it in npm 

import crypto from "crypto"; // For generating unique IDs

const router = express.Router();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); 

const AI_STOCK_IMAGES = [
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
  "https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg",
  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
  "https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg",
  "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg",
  "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg",
  "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
  "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg",
];

const CACHE_TIME = 7 * 24 * 60 * 60 * 1000;

const shouldFallbackOnError = (error) => {
  if (error.response) {
    const status = error.response.status;
    return status === 402 || status === 429 || status >= 500;   // for which status should i be doing fallback ....
  }
  return !error.response;
};

function getDifficultyLevel(time, ingredientsCount) {
  if (time <= 20 && ingredientsCount <= 5) return "Easy";
  if (time <= 45 && ingredientsCount <= 10) return "Medium";  // defining easy, medium, hard as don't come by default
  return "Hard";
}

function normalizeEdamamRecipe(edamamHit, searchIngredients) {
  const r = edamamHit.recipe;
  const ingredientsCount = r.ingredientLines?.length || 0;
  const time = r.totalTime || 30;   // defining 30 in case time is not available prep and cooking of any dish does take min 30min 
  const instructions = r.url;

  return {
    id: r.uri.split("_")[1],
    title: r.label,
    image: r.image,                         // finally normalization of the data fixed i will do the same for spoonacular and ai
    ingredients: r.ingredientLines,
    searchTerms: searchIngredients,
    instructions: instructions,
    prepTime: time,
    difficulty: getDifficultyLevel(time, ingredientsCount),
    servings: r.yield || null,
    cuisine:
      Array.isArray(r.cuisineType) && r.cuisineType.length
        ? r.cuisineType.join(", ")
        : "Not specified",
    dietType:
      Array.isArray(r.dietLabels) && r.dietLabels.length
        ? r.dietLabels.join(", ")
        : "Not specified",
    createdAt: new Date(),
    apiUsed: "Edamam",
  };
}

async function fetchFromEdamam(ingredients, cuisine) {
  console.log("... Calling Edamam API...");
  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;
  const ingredientsString = ingredients.join(",");

  let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${ingredientsString}&app_id=${appId}&app_key=${appKey}`;

  if (cuisine) {
    console.log(`... Filtering Edamam for cuisine: ${cuisine}`);
    url += `&cuisineType=${encodeURIComponent(cuisine)}`;
  }

  const response = await axios.get(url, {
    headers: {                                             // this is the resion why my edmam api was not 
      "Edamam-Account-User": "0",                          // working it needs a unique header
    },
  });

  return response.data.hits.map((item) => {
    return normalizeEdamamRecipe(item, ingredients);
  });
}

cron.schedule("0 */6 * * *", async () => {                     // let's sedule the deletion of old data using cron
  const cutoff = new Date(Date.now() - CACHE_TIME);
  const result = await Recipe.deleteMany({ createdAt: { $lt: cutoff } });
  console.log(`Cache cleanup: Removed ${result.deletedCount} old recipes.`);
});

function normalizeGenAIRecipe(aiRecipe, searchIngredients) {
  const ingredientsCount = aiRecipe.ingredientList?.length || 0;
  const time = aiRecipe.prepTime || 30; 
  return {
    id: crypto.randomUUID(),
    title: aiRecipe.title,
    image: AI_STOCK_IMAGES[Math.floor(Math.random() * AI_STOCK_IMAGES.length)],
    ingredients: aiRecipe.ingredientList,
    instructions: Array.isArray(aiRecipe.steps)              // let's make it to check for array to solve
      ? aiRecipe.steps.join("\n")                           //(type Array) at path "instructions"
      : aiRecipe.steps,
    searchTerms: searchIngredients,                   // normalizing ai data
    prepTime: time,
    difficulty: getDifficultyLevel(time, ingredientsCount),
    servings: aiRecipe.servings || null,
    cuisine: aiRecipe.cuisine || "Not specified",
    dietType: "Not specified",
    createdAt: new Date(),
    apiUsed: "GenAI",
    generatedByAI: true,
  };
}


async function fetchFromGenAI(ingredients, cuisine) {
  console.log("... Calling GenAI API...");

  const cuisinePrompt = cuisine
    ? `You MUST ensure all recipes are from ${cuisine} cuisine.`
    : "You can generate recipes from any cuisine.";
  // my unique prompt after ... (don't know how many times i refined it.)
  const prompt = `
    You are a helpful recipe assistant. Generate 5-7 recipes based on the following ingredients: ${ingredients.join(
      ", "
    )}.
    You MUST respond with ONLY a valid JSON array of objects. Do not include any text, markdown, or "json" tags before or after the array.
    Each object in the array must have the following structure:
    {
      "title": "Recipe Name",
      "prepTime": 30,
      "servings": 4,
      "cuisine": "e.g., ${cuisine || "Indian"}",
      "ingredientList": ["1 cup ingredient", "1/2 tsp other ingredient"],
      "steps": "1. Do this.\\n2. Do that.\\n3. Serve."
    }
  `;


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",                        // finally got a model that works
      contents: prompt,
    });

    const text = response.text;

    console.log("... Cleaning AI Response ...");

    const jsonStart = text.indexOf('['); 
    const jsonEnd = text.lastIndexOf(']');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Raw AI Response (no JSON array found):", text);
      alert("please try using Search Recipes instead");
      throw new Error("AI did not return a valid JSON array.");
    }                                                                     // now its finally working ...

    const cleanedText = text.substring(jsonStart, jsonEnd + 1);

    const recipesJson = JSON.parse(cleanedText); 
    
    return recipesJson.map((recipe) =>
      normalizeGenAIRecipe(recipe, ingredients)
    );

  } catch (e) {
    console.error("GenAI JSON parse or API failed:", e.message);
    if (e.message.includes("JSON")) {
       console.error("Raw AI Response (that failed parsing):", response.text); 
    }
    throw new Error("Failed to parse GenAI response.");
  }
}

router.post("/search", async (req, res) => {
  const { ingredients, cuisine } = req.body;
  if (!ingredients || !ingredients.length)
    return res.status(400).json({ message: "No ingredients provided" });                // search route to serch recipes

  try {
    const query = {
      $or: [
        { searchTerms: { $all: ingredients, $size: ingredients.length } },
        { ingredients: { $all: ingredients, $size: ingredients.length } },
      ],                                                                                // db search
      createdAt: { $gt: new Date(Date.now() - CACHE_TIME) },
    };

    if (cuisine) {
      query.cuisine = cuisine; 
    }

    const cachedRecipes = await Recipe.find(query);

    if (cachedRecipes.length > 0) {
      console.log("Returning from cache");
      return res.json(cachedRecipes);
    }

    console.log(" Cache miss. Calling Spoonacular API...");
    let recipesData;
    try {
                                                            // try spoonacular 1st api
      const apiKey = process.env.SPOONACULAR_API_KEY;
      let searchUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients.join(
        ","
      )}&number=5&apiKey=${apiKey}`;
      if (cuisine) {
        console.log(`... Filtering Spoonacular for cuisine: ${cuisine}`);
        searchUrl += `&cuisine=${encodeURIComponent(cuisine)}`;
      }
      const searchResponse = await axios.get(searchUrl);
      const recipeIds = searchResponse.data.results.map((r) => r.id).join(",");
      if (!recipeIds) {
        return res.json([]);
      }
      const detailsUrl = `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${apiKey}`;
      const detailsResponse = await axios.get(detailsUrl);
      recipesData = detailsResponse.data.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        ingredients: r.extendedIngredients.map((i) => i.name),
        searchTerms: ingredients,
        instructions: r.instructions,
        prepTime: r.readyInMinutes || null,
        difficulty: getDifficultyLevel(
          r.readyInMinutes || 0,
          r.extendedIngredients?.length || 0
        ),
        servings: r.servings || null,
        cuisine:
          Array.isArray(r.cuisines) && r.cuisines.length
            ? r.cuisines.join(", ")
            : "Not specified",
        dietType:
          Array.isArray(r.diets) && r.diets.length
            ? r.diets.join(", ")
            : "Not specified",
        createdAt: new Date(),
        apiUsed: "Spoonacular",
      }));
    } catch (spoonacularError) {
      console.error("Spoonacular API failed:", spoonacularError.message);
      if (shouldFallbackOnError(spoonacularError)) {
        console.log("Falling back to Edamam API...");                   // catch the error and trick him that its not an error
        try {
          recipesData = await fetchFromEdamam(ingredients, cuisine);      // try edamam 2nd api
        } catch (edamamError) {
          console.error(
            "Edamam API fallback also failed:",
            edamamError.message
          );

          if (shouldFallbackOnError(edamamError)) {
            console.log("Falling back to GenAI API...");
            try {
              recipesData = await fetchFromGenAI(ingredients, cuisine);     // finally try with gemini api
            } catch (genAiError) {
              console.error("GenAI fallback also failed:", genAiError.message);
              return res
                .status(500)
                .json({ message: "Error fetching recipes from all sources" });
            }
          } else {
            throw edamamError;
          }
        }
      } else {
        throw spoonacularError;
      }
    }

    if (recipesData && recipesData.length > 0) {
      const upsertOperations = recipesData.map((recipe) => ({
        updateOne: {
          filter: { id: recipe.id },
          update: { $set: recipe },                             // making instruction for bulkwrite
          upsert: true,
        },
      }));
      await Recipe.bulkWrite(upsertOperations);               // bulk writting all the recipies in db
    }
    res.json(recipesData || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

router.post("/generate", async (req, res) => {
  const { ingredients, cuisine } = req.body;
  if (!ingredients || !ingredients.length)                        // generate route to generate ai responce
    return res.status(400).json({ message: "No ingredients provided" });

  try {
    const recipesData = await fetchFromGenAI(ingredients, cuisine);

    if (recipesData && recipesData.length > 0) {
      const upsertOperations = recipesData.map((recipe) => ({
        updateOne: {
          filter: { id: recipe.id },
          update: { $set: recipe },
          upsert: true,
        },
      }));
      await Recipe.bulkWrite(upsertOperations);
    }

    res.json(recipesData);
  } catch (error) {
    console.error("GenAI route failed:", error);
    res.status(500).json({ message: "Failed to generate AI recipes." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findOne({ id: id });                      // dynamic route to check recipe detail

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching single recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
