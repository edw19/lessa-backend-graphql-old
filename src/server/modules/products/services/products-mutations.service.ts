import { ProductModel } from "../models/product-entity";
import { ProductsQueryService } from "./products-queries.services";
import { Types } from "mongoose"
import { CategoriesService } from "server/modules/categories/categories.services";
import { GraphQLError } from "graphql";

export class ProductMutationService {
    static async createProduct(product: any, company: Types.ObjectId) {
        const existeCodeProduct = await ProductsQueryService.verifyProductExists(product.code, company);

        if (existeCodeProduct)
            throw new GraphQLError("Código del producto ya existe");

        // verificar si existe la categoría servicio en la compañía y si no la crea
        if (product.kind === "Service") {
            const category = await CategoriesService.verifyCategoryExists("Servicios", company);
            if (!category) {
                const newCategory = await CategoriesService.createCategory("Servicios", company);
                product.category = newCategory.id;
            } else {
                product.category = category.id;
            }
        }
        const newProduct = await ProductModel.create({
            ...product,
            company,
            additionalInfomation: product.additionalInformation,
        });

        return newProduct;
    }

    static async updateProduct(product: any, company: Types.ObjectId) {
        try {
            const existsProduct = await ProductModel.findById(product.id)
            if (!existsProduct) throw new GraphQLError("producto no registrado");

            if (existsProduct.code !== product.code) {
                const existsCodeProduct = await ProductModel.findOne({
                    $and: [
                        { code: product.code },
                        { company },
                    ],
                });
                if (existsCodeProduct) throw new GraphQLError("Código del producto ya existe");
            }

            return await ProductModel.findOneAndUpdate(
                { _id: product.id },
                { ...product } as any,
                { new: true }
            );
        } catch (error: any) {
            throw new Error(`${product.name}: ${error.message}`);
        }
    }

    static async updateStock(id: string | Types.ObjectId, units: number, operation: "add" | "substract" = "add") {

        const product = await ProductModel.findByIdAndUpdate(
            { _id: id },
            { $inc: { stock: operation === "add" ? units : -units } },
            { new: true }
        );
        console.log({ product })
        if (product) {
            return {
                id: product.id,
                stock: product.stock,
            }
        }
    }
}