import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import type { MyContext } from "../../@types/MyContext";
import { Categories } from "modules/categories/categories.model";
import { CategoriesService } from "./categories.services";

@Resolver()
export class CategoriesResolver {
  @Query(() => [Categories])
  @Authorized("USER-OWNER", "USER-COMPANY")
  async getCategories(@Ctx() { req }: MyContext) {
    return await CategoriesService.getCategories(req.company.id);
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Categories)
  async createCategory(@Arg("name") name: string, @Ctx() { req }: MyContext) {
    return await CategoriesService.createCategory(name, req.company!.id);
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Categories)
  async deleteCategory(@Arg("id") id: string) {
    return await CategoriesService.deleteCategory(id);
  }
}
