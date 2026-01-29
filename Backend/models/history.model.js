import { Schema, model } from "mongoose";

const historySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
      index: true,
    }
  },
  { timestamps: true }
);

historySchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const history = model('History', historySchema)

export default history;

