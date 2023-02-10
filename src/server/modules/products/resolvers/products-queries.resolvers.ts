import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
  Int,
} from "type-graphql";
import type { MyContext } from "../../../@types/MyContext";
import { Product, ProductModel } from '../models/product-entity'
import { InvestmentCategory, PercentProductsCategories, ProductsPagination } from "../types";
import { addMonths, startOfMonth, subDays, subMonths } from "date-fns";
import { mongoose } from "@typegoose/typegoose";
import { Categories, CategoriesModel } from 'modules/categories/categories.model'
import { SalesModel } from "modules/sales/entities";
import { ProductsQueryService } from "../services/products-queries.services";
import { InputOptionsCursorPaginator } from "../inputs/options-cursor-paginator.input";
import { InputGetProductsQuery } from "../inputs/get-products-query.input";
import { Types } from "mongoose"

@Resolver(() => Product)
export class ProductsQueryResolver {
  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [Product], { nullable: true })
  async getAllProducts(@Ctx() { req }: MyContext) {
    const another = await ProductsQueryService.getAllProducts(req.company.id);
    return another
  }

  @Query(() => Product)
  async getProduct(@Arg("id") id: Types.ObjectId) {
    return await ProductsQueryService.getProduct(id);
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => ProductsPagination, { nullable: true })
  async getProducts(
    @Arg("query", { nullable: true }) query: InputGetProductsQuery,
    @Arg("pagination") pagination: InputOptionsCursorPaginator,
    @Ctx() { req }: MyContext
  ) {
    return await ProductsQueryService.getProducts({
      query: {
        ...query,
        company: req.company.id,
      },
      options: pagination,
    })
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => String)
  async investmentProducts(@Ctx() { req }: MyContext) {
    try {
      const products = await ProductModel.find({
        company: req.company!.id,
      }).select("-_id stock priceBuy");

      const amount = products
        .reduce(
          (acc, product) => acc + product.stock * Number(product.priceBuy),
          0
        )
        .toFixed(2);
      return amount;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [InvestmentCategory])
  async investmentProductsByCategory(@Ctx() { req }: MyContext) {
    const categories = await CategoriesModel.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(req.company!.id) } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "categoryQuery",
        },
      },
      {
        $project: {
          name: 1,
          "categoryQuery.stock": 1,
          "categoryQuery.priceBuy": 1,
        },
      },
    ]);
    const amountProductsByCategory: any[] = [];
    categories.forEach((category: any) => {
      const item = { id: "", name: "", countProducts: "", amount: "" };
      item.id = category.id;
      item.name = category.name;
      item.countProducts = category.categoryQuery.length;

      const amount = category.categoryQuery.reduce((acc: any, item: any) => {
        return acc + item.stock * Number(item.priceBuy);
      }, 0);
      item.amount = amount.toFixed(2);
      amountProductsByCategory.push(item);
    });

    return amountProductsByCategory
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .filter((item) => Number(item.amount) > 0);
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => String)
  async stockCoverageIndicator(@Ctx() { req }: MyContext) {
    const date = new Date();
    const dateMonthAgo = subMonths(date, 1);
    const dateDayAgo = subDays(date, 1);
    try {
      const salesMonthly = await SalesModel.countDocuments({
        company: new mongoose.Types.ObjectId(req.company.id),
        createdAt: {
          $gte: dateMonthAgo,
          $lte: dateDayAgo,
        },
      });
      const [{ totalStock }] = await ProductModel.aggregate([
        { $match: { company: new mongoose.Types.ObjectId(req.company!.id) } },
        { $group: { _id: "$company", totalStock: { $sum: "$stock" } } },
        { $project: { _id: false, totalStock: true } },
      ]);
      if (salesMonthly === 0) return "Sin información";
      const averageSales = salesMonthly / 4;
      const coverageIndicator = Number((totalStock / averageSales).toFixed(2));
      return isNaN(coverageIndicator) ? "Sin información" : coverageIndicator;
    } catch (error) {
      return "Sin información";
    }
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [PercentProductsCategories])
  async percentProductsByCategories(@Ctx() { req }: MyContext) {
    try {
      const result = await CategoriesModel.aggregate([
        { $match: { company: new mongoose.Types.ObjectId(req.company!.id) } },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "products",
          },
        },
        {
          $project: {
            name: 1,
            totals: {
              $sum: {
                $map: {
                  input: "$products",
                  as: "product",
                  in: "$$product.stock",
                },
              },
            },
          },
        },
      ]);
      return result.map(resul => ({ id: resul.id, name: resul.name, totals: resul.totals }))
    } catch (error) {
      return [];
    }
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => String)
  async productsExpiresMonth(
    @Arg("months", () => Int) months: number,
    @Ctx() { req }: MyContext
  ) {
    return await ProductsQueryService.getProductsExpireInMonth(months, req.company.id);
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [Product])
  async productsExpiresMonthQuery(
    @Arg("months", () => Int) months: number,
    @Ctx() { req }: MyContext
  ) {
    try {
      const date = new Date();
      const dateYearAgo = addMonths(date, months);
      const productsExpires = await ProductModel.find({
        company: new mongoose.Types.ObjectId(req.company!.id),
        dateExpires: { $gte: date, $lte: dateYearAgo },
      });
      return productsExpires;
    } catch (error) {
      throw new Error("No se pudo obtener los productos próximos a expirar");
    }
  }

  @FieldResolver(() => Categories, { nullable: true })
  async category(@Root() category: any) {
    const res = await CategoriesModel.findById(category.category);
    return res;
  }
}
