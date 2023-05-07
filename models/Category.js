import { model, models, Schema, mongoose } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  properties: [{ type: { name: { type: String }, value: { type: [] } } }],
});

export const Category = models.Category || model("Category", CategorySchema);
