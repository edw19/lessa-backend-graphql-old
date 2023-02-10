import { Arg, Authorized, Ctx, Query, Resolver, Int, FieldResolver, Root } from "type-graphql";
import { Clients, ClientsModel, } from 'modules/clients/entities';
import { Sales, SalesModel } from 'modules/sales/entities';
import type { MyContext } from "../../@types/MyContext";
import { SalesCharts, SalesResults, MostSelledProducts, PercentageSalesCredit, GetSalesType } from "modules/sales/types";
import { startOfDay, endOfDay, subDays, addDays, } from "date-fns";
import { SalesService } from "server/modules/sales/services/sales.services";
import { generateObjectId } from "server/utils/generateId";
import { Types } from "mongoose"

@Resolver(() => Sales)
export class SalesQueryResolver {
  @Authorized("USER-COMPANY")
  @Query(() => SalesResults, { nullable: true })
  async salesResults(@Ctx() { req }: MyContext) {
    const company = req.company.id;
    const dailySales = await SalesService.totalSalesAndAmount({
      company,
      queryBy: 'daily',
    })

    const weeklySales = await SalesService.totalSalesAndAmount({
      company,
      queryBy: 'weekly',
    })

    const monthlySales = await SalesService.totalSalesAndAmount({
      company,
      queryBy: 'monthly',
    })

    return {
      dailySales,
      weeklySales,
      monthlySales
    }
  }

  @Authorized("USER-COMPANY")
  @Query(() => [MostSelledProducts], { nullable: true })
  async mostSelledProducts(
    @Ctx() { req }: MyContext,
    @Arg("queryBy") queryBy: string
  ) {
    const products = await SalesService.mostSelledProducts({ company: req.company!.id, queryBy })
    return products;
  }

  @Authorized("USER-COMPANY")
  @Query(() => Sales)
  async getSale(@Arg("id") id: Types.ObjectId) {
    return await SalesService.getSale(id);
  }

  @Authorized("USER-COMPANY")
  @Query(() => [GetSalesType])
  async getSales(
    @Arg("queryBy") queryBy: string,
    @Arg("startDate", { nullable: true }) startDate: Date,
    @Arg("endDate", { nullable: true }) endDate: Date,
    @Ctx() { req }: MyContext
  ) {
    return await SalesService.getSales({ company: req.company.id, queryBy, startDate, endDate })
  }

  @Authorized("USER-COMPANY")
  @Query(() => PercentageSalesCredit)
  async percentageSalesCredit(@Ctx() { req }: MyContext) {
    return await SalesService.percentageCreditSales({ company: req.company.id })
  }

  @Authorized("USER-COMPANY")
  @Query(() => [SalesCharts])
  async getSalesForCharts(
    @Arg("limit", () => Int) limit: number,
    @Ctx() { req }: MyContext
  ) {
    const date = new Date();
    let datePast = subDays(date, limit);
    let data = [];
    for (let i = 0; i <= limit; i++) {
      let count = 1;
      let daily: any = { id: "", total: 0, createdAt: "" };
      const dailySales = await SalesModel.find({
        company: req.company!.id,
        createdAt: {
          $gte: startOfDay(datePast),
          $lte: endOfDay(datePast),
        },
      }).select("createdAt total");

      for (let j = 0; j < dailySales.length; j++) {
        daily.total += Number(dailySales[j].total);
        daily.createdAt = dailySales[j].createdAt;
      }
      data.push(Object.assign({}, daily));
      datePast = addDays(datePast, count);
      count++;
    }

    return data
      .filter((dat) => dat.total > 0)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getUTCDate() -
          new Date(a.createdAt).getUTCDate()
      ).map(dat => ({ id: generateObjectId(), total: dat.total, createdAt: dat.createdAt }));
  }

  @FieldResolver(() => Clients, { nullable: true })
  async client(@Root() { client }: Sales) {
    return await ClientsModel.findById(client);
  }
}
