import { mongooseConnect } from "@/lib/mongoose";
import { Setting } from "@/models/Setting";
import { isAdminRequest } from "./auth/[...nextauth]";

async function Handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "PUT") {
    const { name, value } = req.body;

    // Tìm kiếm setting theo name trên database
    const settingDoc = await Setting.findOne({ name });

    // Nếu đã tồn tại Setting, thực hiện update
    if (settingDoc) {
      settingDoc.value = value;
      await settingDoc.save();
      res.json(settingDoc);
    }
    // Nếu chưa tồn tại Setting, thực hiện tạo Setting mới
    else {
      res.json(await Setting.create({ name, value }));
    }
  }

  if (req.method === "GET") {
    const { name } = req.query;
    res.json(await Setting.findOne({ name }));
  }
}

export default Handler;
