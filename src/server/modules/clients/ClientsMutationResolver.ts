import { Arg, Authorized, Ctx, Mutation, Resolver, ID } from "type-graphql";
import type { MyContext } from "../../@types/MyContext";
import { Clients, ClientsModel } from "server/modules/clients/entities";
import { InputClient, InputCredit, InputPayCredit } from "server/modules/clients/inputs";
import { ClientsService } from "./services/clients.services";
import { PayCreditType } from "./types/pay-credit.type";

@Resolver()
export class ClientsMutationResolver {
  @Authorized("USER-COMPANY")
  @Mutation(() => Clients)
  async createClient(
    @Arg("client") client: InputClient,
    @Ctx() { req }: MyContext
  ) {
    const existsClient = await ClientsModel.findOne({
      $and: [
        { company: req.company!.id },
        { identificationCard: client.identificationCard },
      ],
    }).exec();

    if (existsClient)
      throw new Error("El cliente que tratas de ingresar ya existe");

    try {
      const res = await new ClientsModel({
        ...client,
        company: req.company!.id,
      }).save();
      return res;
    } catch (error) {
      throw new Error(
        "Revisa el número de cédula del cliente, puede ser que ya este registrado"
      );
    }
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Clients)
  async deleteClient(@Arg("id", () => ID) id: string) {
    return await ClientsModel.findByIdAndDelete(id);
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => PayCreditType)
  async payCredit(@Arg("client") client: InputPayCredit) {
    return await ClientsService.addClientCreditPayment(client);
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Clients)
  async updateCredit(
    @Arg("credit") credit: InputCredit
  ) {
    const client = await ClientsModel.findById(credit.client).exec();
    const currentCredit = Number(client?.credit).toString();
    const inCommingCredit = Number(credit.total).toString();
    const creditCalculate = parseFloat(currentCredit + inCommingCredit).toFixed(
      2
    );
    return await ClientsModel.findOneAndUpdate(
      { _id: credit.client },
      {
        $set: {
          credit: creditCalculate,
        },
      },
      { new: true }
    ).exec();
  }
}
