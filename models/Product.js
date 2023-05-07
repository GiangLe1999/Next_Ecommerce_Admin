import mongoose, { model, models, Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);
