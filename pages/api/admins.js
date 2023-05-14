import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { isAdminRequest } from "./auth/[...nextauth]";

async function Handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "POST") {
    const { email } = req.body;

    const emailCollection = await Admin.find();

    const existingEmail = emailCollection.map((e) => e.email.toString());

    if (existingEmail.indexOf(email) === -1) {
      res.json(await Admin.create({ email }));
    } else {
      res.status(401).json({ message: "This Gmail is already existed!" });
      return;
    }
  }

  if (req.method === "GET") {
    res.json(await Admin.find());
  }

  if (req.method === "DELETE") {
    if (req.query?.id) {
      await Admin.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}

export default Handler;
