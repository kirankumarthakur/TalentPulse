import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    firebaseId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
        type: Number,
        default: 0,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "auth",
  },
);

const User = mongoose.model("User", authSchema);
export default User;