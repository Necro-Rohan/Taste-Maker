import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  preferences: {
    type: [String],
    default: []
  },
  savedRecipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Recipe",
    default: []
  },
  profilePicture: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;