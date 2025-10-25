import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    id: {
      type: String,
      required: [true, "Spoonacular ID is required"],
      unique: true,
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
    },
    instructions: {
      type: String,
      required: [true, "Instructions are required"],
    },
    prepTime: {
      type: Number,
      default: 0,
    },
    servings: {
      type: Number,
      default: 1,
    },
    cuisine: {
      type: String,
      default: "",
    },
    dietType: {
      type: String,
      default: "",
    },
    image: {
      type: String,
    },
    generatedByAI: {
      type: Boolean,
      default: false,
    },
    apiUsed: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    searchTerms: {
      // USER'S query
      type: [String],
      index: true, // For faster search
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;