import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import type { MyContext } from "../../@types/MyContext";
import { DeleteSale, ReturnCreateSale } from "modules/sales/types";
import { CreateSaleInput } from "modules/sales/inputs";
import { BillingElectronic } from 'modules/billing/services/billing-electronic.service'
import { SalesService } from "./services/sales.services";
import { Types } from "mongoose"

@Resolver()
export class SalesMutationResolver {
  @Authorized("USER-COMPANY")
  @Mutation(() => ReturnCreateSale, { nullable: true })
  async createSale(@Arg("sale") sale: CreateSaleInput, @Ctx() { req }: MyContext) {
    // console.log("llega a la mutation", sale)
    try {
      const { products, saleId } = await SalesService.createSaleService({ ...sale, company: req.company.id });
      // console.log({products})
      if (sale.credit) {
        await SalesService.saveCreditOnSale({
          client: sale.client,
          createdAt: sale.createdAt,
          total: sale.total,
          amountToBePaid: sale.amountToBePaid,
        })
      }
      if (sale.electronicBilling) {
        await BillingElectronic.generateElectronicInvoice({ company: req.company.id, client: sale.client, total: sale.total, products: sale.products })
      }
      return { saleId, products };
    } catch (error) {
      console.log({ error })
      throw new Error("Hubo un error creando la venta");
    }
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => DeleteSale)
  async deleteSale(@Arg("id") id: Types.ObjectId, @Ctx() { req }: MyContext) {
    return await SalesService.deleteSaleService(id, req.cashier.id);
  }
}
