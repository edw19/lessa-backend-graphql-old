import { mongoose } from "@typegoose/typegoose";
import { endOfDay, startOfDay } from "date-fns";
import { Types } from "mongoose"
import { generateObjectId } from "server/utils/generateId";
import { Sales, SalesModel } from "modules/sales/entities";
import { DatesServices } from "../../../services/dates.services";
import { ClientsService } from "server/modules/clients/services/clients.services";
import { ProductMutationService } from "server/modules/products/services/products-mutations.service";
import { CashMovementsService } from "server/modules/cash_movements/services/cash-movements.service";
import { CashierService } from "server/modules/cashiers/services/cashier.service";

type GetSales = { company: Types.ObjectId, queryBy: string, startDate: Date, endDate: Date };

export class SalesService {
    static async getSale(id: Types.ObjectId) {
        return await SalesModel.findById(id)
    }

    static async createSale(sale: Sales) {
        const some = sale.products.some((product) => product.kind.includes("CommonProduct"));

        if (some) {
            sale.products = sale.products.map((product) => {
                const commonProduct = product.kind.includes("CommonProduct");
                return {
                    ...product,
                    productId: commonProduct ? generateObjectId() : product.productId,
                    priceBuy: commonProduct ? product.priceSale : product.priceBuy,
                }
            });
        }
        const res = await SalesModel.create(sale);
        return res
    }

    static async createSaleService(sale: Sales) {
        const products = [];
        const newSale = await SalesService.createSale(sale);

        for (const product of sale.products) {

            if (product.kind === "CommonProduct" || product.kind === "Service") continue;
            const productUpdated = await ProductMutationService.updateStock(product.productId, product.units, "substract");
            products.push({ id: productUpdated?.id, stock: productUpdated?.stock })
        }

        return { saleId: newSale.id, products };
    }

    static async getSales({ company, queryBy, startDate, endDate }: GetSales) {
        const { parseDateEnd, parseDateStart } = DatesServices.getDatesRange({ queryBy, startDate, endDate })
        return await SalesModel.aggregate(
            [{
                $match: {
                    company: generateObjectId(company),
                    createdAt: {
                        $gte: parseDateStart,
                        $lte: parseDateEnd,
                    },
                }
            },
            { $unwind: '$products' },
            {
                $group: {
                    _id: "$_id",
                    totalUnits: { $sum: "$products.units" },
                    totalSale: { $addToSet: "$total" },
                    credit: { $addToSet: "$credit" },
                    createdAt: { $addToSet: "$createdAt" },
                    investment: { $sum: { $multiply: ["$products.priceBuy", "$products.units"] } },
                }
            },
            { $unwind: '$totalSale' },
            { $unwind: '$credit' },
            { $unwind: '$createdAt' },
            { $addFields: { profit: { $round: [{ $subtract: ["$totalSale", "$investment"] }, 2] } } },
            {
                $project: {
                    credit: 1,
                    totalSale: 1,
                    investment: 1,
                    createdAt: 1,
                    totalUnits: 1,
                    profit: 1,
                }
            },
            { $sort: { createdAt: -1 } }
            ]);
    }

    // unused
    static async getTotalsSales({ company, queryBy, startDate, endDate }: { company?: string, queryBy: string, startDate: Date, endDate: Date }) {
        const { parseDateEnd, parseDateStart } = DatesServices.getDatesRange({ queryBy, startDate, endDate })
        const results = await SalesModel.aggregate([
            {
                $match: {
                    company: new mongoose.Types.ObjectId(company),
                    createdAt: {
                        $gte: parseDateStart,
                        $lte: parseDateEnd,
                    }
                }
            },
            { $unwind: '$products' },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" },
                    investment: { $sum: { $multiply: ["$products.priceBuy", "$products.units"] } }
                }
            },
            {
                $project: {
                    investment: { $round: ["$investment", 2] },
                    total: { $round: ["$total", 2] },
                    subTotal: { $round: [{ $divide: ["$total", 1.12] }, 2] },
                    iva: {
                        $round: [
                            {
                                $subtract: ["$total", { $divide: ["$total", 1.12] }]

                            }, 2
                        ]
                    },

                    profit: {
                        $round: [
                            {
                                $subtract: ["$total", "$investment"]
                            }, 2
                        ]
                    }
                }
            }
        ])

        const investment = results[0]?.investment || 0.00
        const total = results[0]?.total || 0.00
        const subTotal = results[0]?.subTotal || 0.00
        const iva = results[0]?.iva || 0.00
        const profit = results[0]?.profit || 0.00

        return {
            sales: 0,
            investment,
            total,
            subTotal,
            iva,
            profit
        }
    }

    static async countSales({ company, dateStart, dateEnd }: { company: Types.ObjectId, dateStart: Date, dateEnd: Date }): Promise<number> {
        const parseDateStart = startOfDay(new Date(dateStart))
        const parseDateEnd = endOfDay(new Date(dateEnd))
        const total = await SalesModel
            .find({ company, })
            .where("createdAt")
            .gte(parseDateStart as any)
            .lte(parseDateEnd as any)
            .countDocuments()

        return total
    }

    static async totalSalesAndAmount({ company, queryBy }: { company: any, queryBy?: string, dateStart?: Date, dateEnd?: Date }) {
        const { parseDateEnd, parseDateStart } = DatesServices.getDatesRange({ queryBy })
        const result = await SalesModel.aggregate([
            {
                $match: {
                    company: new mongoose.Types.ObjectId(company),
                    createdAt: {
                        $gte: parseDateStart,
                        $lte: parseDateEnd,
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" },
                    salesCount: { $sum: 1 }
                }
            }
        ])

        const total = result[0]?.total.toFixed(2) || 0.00
        const salesCount = result[0]?.salesCount || 0.00

        return { id: generateObjectId(), total, salesCount }
    }

    static async mostSelledProducts({ company, queryBy }: { company: any, queryBy: string }) {
        const { parseDateEnd, parseDateStart } = DatesServices.getDatesRange({ queryBy })
        const result = await SalesModel.aggregate([
            {
                $match: {
                    company: new mongoose.Types.ObjectId(company),
                    createdAt: {
                        $gte: parseDateStart,
                        $lte: parseDateEnd,
                    }
                }
            },
            { $unwind: '$products' },
            {
                $group: {
                    _id: "$products.productId",
                    count: { $sum: "$products.units" },
                    product: { $first: "$products.name" }
                },
            },
            {
                $sort: { "count": -1 }
            }
        ]).limit(10)

        return result.map((product: any) => ({ name: product.product, units: product.count }))
    }

    static async percentageCreditSales({ company }: { company: Types.ObjectId }) {
        const totalSales = await SalesModel.find({ company }).countDocuments()

        const totalSalesCredit = await SalesModel.find({ company, credit: true }).countDocuments()
        const totalSalesWithoutCredit = await SalesModel.find({ company, credit: false }).countDocuments()

        const percentageSalesCredit = (totalSalesCredit * 100 / totalSales).toFixed(2)
        const percentageSalesWithoutCredit = (totalSalesWithoutCredit * 100 / totalSales).toFixed(2)

        return {
            totalSales,
            totalSalesWithoutCredit,
            percentageSalesWithoutCredit,
            totalSalesCredit,
            percentageSalesCredit
        }

    }

    static async saveCreditOnSale(
        { client, total, createdAt, amountToBePaid }:
            { client: Types.ObjectId; total: number; createdAt: Date, amountToBePaid: number }) {
        const date = new Date(createdAt);

        const currentCredit = await ClientsService.getCurrentClientCredit(client)
        const result = currentCredit + total;
        const credit = +result.toFixed(2);

        await ClientsService.addClientCreditPayment({
            client,
            total: credit,
            date,
            payAmount: total,
            pay: false,
        });

        if (amountToBePaid) {
            const total = credit - amountToBePaid;
            await ClientsService.addClientCreditPayment({
                client,
                total,
                date,
                payAmount: amountToBePaid,
                pay: true,
            });
        }
    }

    static async deleteSale(id: Types.ObjectId) {
        return await SalesModel.findByIdAndDelete(id);
    }

    static async deleteSaleService(id: Types.ObjectId, cashierId: Types.ObjectId) {
        // verify if sale exists
        const sale = await SalesService.getSale(id);
        if (!sale) throw new Error("venta no existe")

        // restore stock after delete sale
        const products = [];
        for (const productSold of sale.products) {
            if (productSold.kind === "CommonProduct") continue;
            const product = await ProductMutationService.updateStock(productSold.productId, productSold.units, "add")
            products.push({ id: product?.id, stock: product?.stock })
        }

        // restore credit if sale is to credit
        // if (sale.credit) {
        //     const client = await ClientsService.getClient(sale.client!);

        // }

        // restore cashmovement if sale is registered
        await CashMovementsService.deleteCashMovementByTransactionId(sale.id);

        const currentCash = await CashierService.updateCash({
            company: sale.company,
            amount: sale.total,
            cashierId,
            cashMovementName: "Restaurar",
        })
        // delete sale
        await SalesService.deleteSale(sale.id)

        return { id, currentCash, products: await products }

    }
}
