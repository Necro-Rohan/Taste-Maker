import {Schema, model} from 'mongoose';

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required for every recipe"],
      trim: true,
      index: true
    },
    id: {
      type: String,
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
    recipeImage: {
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

recipeSchema.index({ title: "text", ingredients: "text" });


const Recipe = model('Recipe', recipeSchema);

export default Recipe;