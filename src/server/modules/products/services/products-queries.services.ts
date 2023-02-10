import { Types } from "mongoose"
import { Product, ProductModel } from "../models/product-entity";
import { IPaginateResult, IPaginateOptions } from 'typegoose-cursor-pagination';
import { DatesServices } from "server/services/dates.services";
import { generateObjectId } from "server/utils/generateId";
import { isNumber } from "class-validator";

type GetProducts = {
    query: {
        company: Types.ObjectId;
        category?: string;
        search?: string
        stock?: number;
    },
    options: IPaginateOptions

}
export class ProductsQueryService {
    static async getProduct(id: Types.ObjectId) {
        return await ProductModel.findById(id);
    }

    static async verifyProductExists(code: string, company: Types.ObjectId) {
        const productExists = await ProductModel.findOne({
            $and: [
                { company },
                { code },
            ]
        });
        if (productExists) return productExists;
        return false;
    }

    static async getAllProducts(company: Types.ObjectId) {
        const res =  await ProductModel.find({ company });        
        return res
    }

    static async getProducts(params: GetProducts): Promise<IPaginateResult<Product> | undefined> {
        const { query, options } = params;
        const { company, category, search, stock } = query;
        try {
            const $regex = ".*" + search + ".*";
            const inititalQuery: any =
            {
                company,
            }

            if (search) {
                inititalQuery.$or = [
                    {

                        name: { $regex },
                    },
                    {

                        code: { $regex, $options: "i" },
                    },
                    {
                        description: { $regex, $options: "i" },
                    },
                ]
            }

            if (category) {
                inititalQuery.category = category;
            }
            if (category === "*") {
                delete inititalQuery.category
            }
            if (isNumber(stock)) {
                inititalQuery.stock = stock === 0 ? stock : { $lte: stock }
            }

            return await ProductModel.findPaged(options, inititalQuery);
        } catch (error) {
            console.log("in getProducts", error);
        }
    }
    static async getProductsExpireInMonth(months: number, company: Types.ObjectId) {
        const date = new Date();
        const parseDateStart = DatesServices.startOfMonth(date);
        const parseDateEnd = DatesServices.addMonthToDate(date, months);

        const result = await ProductModel.aggregate([
            {
                $match: {
                    company: generateObjectId(company),
                    dateExpires: { $gte: parseDateStart, $lte: parseDateEnd },
                },
            },
            {
                $project: {
                    name: 1,
                    dateExpires: 1,
                },
            },
            {
                $count: "NumberProductsExpire",
            },
        ]);
        return result[0]?.NumberProductsExpire || 0;
    }
}