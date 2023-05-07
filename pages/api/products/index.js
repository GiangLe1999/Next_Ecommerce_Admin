import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "GET") {
    const currentProducts = await Product.find();
    return res.json(currentProducts);
  }

  if (req.method === "POST") {
    const { title, price, description, images, category, properties } =
      req.body;

    let productDocument;

    if (
      title ||
      title.trim().length > 0 ||
      price ||
      price.trim.length > 0 ||
      description ||
      description.trim.length > 0
    ) {
      productDocument = await Product.create({
        title,
        price,
        description,
        images,
        category: category || undefined,
        properties,
      });
    }

    return res.json({
      message: "New product was created in database",
      productDocument,
    });
  }
}
