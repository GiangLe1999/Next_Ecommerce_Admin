import { Product } from "../../../models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]";

async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "GET") {
    const product = await Product.findOne({ _id: req.query.id });
    return res.json(product);
  }

  if (req.method === "PUT") {
    const { title, price, description, images, category, properties } =
      req.body;
    await Product.updateOne(
      { _id: req.query.id },
      {
        title,
        price,
        description,
        images,
        category: category || undefined,
        properties,
      }
    );
    return res.json({ message: "Updated successfully" });
  }

  if (req.method === "DELETE") {
    await Product.deleteOne({ _id: req.query.id });
    return res.json({ message: "Deleted successfully" });
  }
}

export default handler;
