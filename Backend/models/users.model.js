import {Schema, model} from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
    trim:true
  },
  myFridge: {
    type: [String],
    default: []
  },
  preferences: {
    type: [String],
    default: []
  },
  savedRecipes: {
    type: [Schema.Types.ObjectId],
    ref: "Recipe",
    default: []
  },
  profilePicture: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const User = model("User", userSchema);

export default User;