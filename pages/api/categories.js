import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (req.method === "POST") {
    const { name, parentCategory, properties } = req.body;

    if (!name || name.trim() === 0) {
      res.status(500).json({ message: "Please enter category name!" });
      return;
    }

    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });

    res.json(categoryDoc);
  }

  if (req.method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;

    let categoryDoc;

    if (parentCategory === "") {
      categoryDoc = await Category.updateOne(
        { _id: _id },
        { $unset: { parent: 1 } }
      );
    }

    categoryDoc = await Category.updateOne(
      { _id: _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );
    res.json(categoryDoc);
  }

  if (req.method === "DELETE") {
    if (req.query?.id) {
      await Category.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
