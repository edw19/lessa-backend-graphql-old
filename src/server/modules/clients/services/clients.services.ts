import { mongoose } from "@typegoose/typegoose";
import { Types } from "mongoose"
import { SalesModel } from "modules/sales/entities";
import { Clients, ClientsModel } from "modules/clients/entities";

export class ClientsService {
  static async searchClients(search: string, company: Types.ObjectId) {
    const $regex = ".*" + search + ".*";
    return await ClientsModel
      .find({
        $or: [
          {

            identificationCard: { $regex },
          },
          {

            name: { $regex, $options: "i" },
          },
          {

            lastName: { $regex, $options: "i" },
          }
        ],
        company,
      }).limit(10)
  }

  static async getClient(id: string | Types.ObjectId): Promise<Clients | null> {
    ClientsModel
    return await ClientsModel.findById(id);
  }

  static async getBestClients(companyId: any, orderBy: string, limit: number) {
    const type = (orderBy === 'amount') ? '$total' : 1;
    const result = await SalesModel.aggregate()
      .match({ company: new mongoose.Types.ObjectId(companyId) })
      .lookup({
        from: 'clients',
        localField: 'client',
        foreignField: '_id',
        as: 'clientInfo'
      })
      .unwind({ path: "$clientInfo" })
      .group({
        _id: "$client",
        total: { $sum: type },
        name: { $first: "$clientInfo.name" },
        lastName: { $first: "$clientInfo.lastName" }
      })
      .project({
        total: { $round: ["$total", 2] },
        client: { $concat: ["$name", " ", "$lastName"] },
      })
      .sort({ total: -1 })
      .limit(limit)

    return result;
  }

  static async addClientCreditPayment(
    { client, total, date, payAmount, pay = true }:
      { client: Types.ObjectId | string; total: number; payAmount: number; date: Date, pay?: boolean }) {
    const result = await ClientsModel.findOneAndUpdate(
      { _id: client },
      {
        $set: { credit: total },
        $push: {
          historyCredit: {
            pay,
            balance: total,
            amount: payAmount,
            date: date,
          },
        },
      },
      { new: true }
    ).select("credit");
    return { id: result?.id, credit: result?.credit };
  }

  static async getCurrentClientCredit(id: Types.ObjectId) {
    const client = await ClientsModel.findById(id);
    return client ? client.credit : 0;
  }
}
