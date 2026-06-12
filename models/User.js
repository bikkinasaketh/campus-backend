import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: String,
    userId: String,
    department: String,
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
