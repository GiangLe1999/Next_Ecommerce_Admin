const { Schema, models, model } = require("mongoose");

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Admin = models?.Admin || model("Admin", AdminSchema);
