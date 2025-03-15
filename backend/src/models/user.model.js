import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 8, // Not required for OAuth users
    },
    profilePic: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "github"],
      default: "local",
    },
    authProviderId: {
      type: String, // Stores unique OAuth provider ID
      default: null,
    },
    lastSeen: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
