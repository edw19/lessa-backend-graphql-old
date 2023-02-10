import { Arg, Authorized, Ctx, Int, Query, Resolver } from "type-graphql";
import { Clients, ClientsModel } from "server/modules/clients/entities";
import type { MyContext } from "../../@types/MyContext";
import { BestClients, ClientCredit, HistoryCredit } from "server/modules/clients/types";
import { convertDocument } from "server/graphql/typegoose-middleware";
import { ClientsService } from "server/modules/clients/services/clients.services";
@Resolver()
export class ClientsQueryResolver {
  @Authorized("USER-COMPANY")
  @Query(() => Clients)
  async getClient(@Arg("id") id: string) {
    return await ClientsModel.findById(id);
  }

  @Authorized("USER-COMPANY")
  @Query(() => [Clients])
  async getClients(@Ctx() { req }: MyContext) {
    const clients = await ClientsModel.find({ company: req.company!.id }).select(
      "-historyCredit"
    );
    return clients;
  }

  @Authorized("USER-COMPANY")
  @Query(() => Clients, { nullable: true })
  async getClientByIdentificationCard(
    @Arg("identificationCard") identificationCard: string,
    @Ctx() { req }: MyContext
  ) {
    const res = await ClientsModel.findOne({
      identificationCard,
      company: req.company!.id,
    }).exec();
    return res;
  }

  @Authorized("USER-COMPANY")
  @Query(() => [HistoryCredit], { nullable: true })
  async getHistoryCredit(@Arg("id") id: string) {
    const res = await ClientsModel.findById(id).select("historyCredit -_id");
    const doc = convertDocument(res!);
    return doc.reverse();
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => Number)
  async getAccumulatedCredit(@Ctx() { req }: MyContext) {
    try {
      const clients = await ClientsModel.find({ company: req.company!.id }).select("credit");
      let total = 0;
      clients.map(client => {
        total += parseFloat(String(client.credit));
      })
      return total.toFixed(2);
    } catch (error) {
      return 0.0
    }
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [ClientCredit])
  async clientsWithMoreCredit(@Ctx() { req }: MyContext) {
    try {
      const clients = await ClientsModel.find({
        company: req.company!.id,
        credit: { $gt: 0 }
      } as any)
        .select("name lastName credit")
        .limit(5);

      return clients.sort((a, b) => Number(b.credit) - Number(a.credit))

    } catch (error) {
      throw new Error("Error al cargar los clientes con más crédito");
    }
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [BestClients])
  async getBestClients(
    @Arg("orderBy", () => String) orderBy: string,
    @Arg("limit", () => Int) limit: number,
    @Ctx() { req }: MyContext
  ) {
    try {
      const clients = await ClientsService.getBestClients(
        req.company.id,
        orderBy,
        limit
      );

      return clients;

    } catch (error) {
      throw new Error("Error al cargar los clientes con más ventas");
    }
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [Clients])
  async searchClients(@Arg("search") search: string, @Ctx() { req }: MyContext) {
    try {
      const clients = await ClientsService.searchClients(
        search,
        req.company!.id,
      );

      return clients;

    } catch (error) {
      throw new Error("Error al cargar los clientes");
    }
  }

}
