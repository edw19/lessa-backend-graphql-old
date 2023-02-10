import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Resolver,
  ID,
  Int,
} from "type-graphql";
import type { MyContext } from "types/MyContext";
import { Product, ProductModel } from '../models/product-entity'
import { CreateProductInput, UpdateProductInput } from "../inputs";
import { ProductMutationService } from "../services/products-mutations.service";

@Resolver()
export class ProductsMutationResolver {
  @Authorized("USER-COMPANY")
  @Mutation(() => Product, { nullable: true })
  async createProduct(
    @Arg("product") product: CreateProductInput,
    @Ctx() { req }: MyContext
  ) {
    return await ProductMutationService.createProduct(product, req.company.id)
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Product)
  async updateProduct(
    @Arg("product") product: UpdateProductInput,
    @Ctx() { req }: MyContext
  ) {
    return await ProductMutationService.updateProduct(product, req.company.id)
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Product)
  async deleteProduct(@Arg("id", () => ID) id: string, @Ctx() ctx: MyContext) {
    try {
      const productsExists = await ProductModel.findOne({ _id: id })
      if (!productsExists) throw new Error("Producto no existe")
      const deletedProduct = await ProductModel.findByIdAndRemove(id);
      return deletedProduct
    } catch (error) {
      throw new Error("No se puede eliminar el producto");
    }
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Product)
  async updateStock(
    @Arg("id", () => ID) id: string,
    @Arg("stock", () => Int) stock: number,
    @Ctx() ctx: MyContext
  ) {
    const productExists = await ProductModel.findById(id).exec();
    if (!productExists)
      throw new Error("El producto que intentas actualizar no existe");
    if (stock <= 0) throw new Error("Ingresa un stock válido");

    return await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        stock,
      },
      { new: true }
    );
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => String)
  async removeImportedData(@Ctx() { req }: MyContext) {
    // try {
    // await ProductModel.deleteMany({ company: req.company!.id });
    // await CategoriesModel.deleteMany({ company: req.company!.id });
    // await VendorModel.deleteMany({ company: req.company!.id });
    // await BuysModel.deleteMany({ company: req.company!.id });
    return "se ha eliminado la información importada";
    // } catch (error) {
    //   // console.log(error);
    // }
  }
}
