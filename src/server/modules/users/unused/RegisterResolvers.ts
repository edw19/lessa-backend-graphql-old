import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserRegisterInput as InputUserRegister } from "../inputs/user-register.input";
import { CompanyService } from "../../companies/services/company.services";
import { EstablishmentService } from "../../establishments/establishment.service";
import { generateObjectId } from "server/utils/generateId";
import { CashierService } from "../../cashiers/services/cashier.service";
import { TypeCashMovementsService } from "../../cash_movements/services/type-cash-movements.service";
import { UsersService } from "../services/users.service";
import { CreateUserForTheCompanyInput } from "../inputs/create-user-for-the-company.input";
import type { MyContext } from "server/@types/MyContext";
import { User } from "../entities";

@Resolver()
export class RegisterResolvers {
  @Mutation(() => String)
  async registerUser(
    @Arg("user") user: InputUserRegister,
  ): Promise<string> {
    const newUser = await UsersService.registerUser(user);
    const defaultTradename = newUser.username!.toLowerCase().trim().split(" ")[0]
    const newCompany = await CompanyService.createCompany({ userOwner: newUser.id, tradename: defaultTradename })
    const newEstablishment = await EstablishmentService.create({
      companyId: newCompany.id,
      userAdmin: generateObjectId(newUser.id),
    })
    // as firts register user admin must be have a cashier for show system app this is cashier by default and
    // his value is 1 that means than is firts cashier of the company
    await CashierService.create({
      establishment: newEstablishment.id,
      cashierUserId: newUser.id,
      emissionPoint: 1,
    })

    // this is required for cashier movements works
    // create type cashier movement called "ventas"
    // create type cashier movement called "compras"
    await TypeCashMovementsService.create({
      company: newCompany.id,
      establishment: newEstablishment.id,
      name: "Ventas",
      isExpense: false,
    })
    await TypeCashMovementsService.create({
      company: newCompany.id,
      establishment: newEstablishment.id,
      name: "Compras",
      isExpense: true,
    })
    return newUser.id;
  }

  @Mutation(() => User)
  async createUserForTheCompany(
    @Arg("user") user: CreateUserForTheCompanyInput,
    @Ctx() { req }: MyContext,
  ) {
    return await UsersService.createUserForTheCompany(
      {
        company: req.company.id,
        establishment: req.establishment.id,
        cashier: req.cashier.id,
        username: user.username,
        pwd: user.pwd,
        role: user.role,
      }
    )
  }

  @Query(() => [User])
  async getUsers(
    @Ctx() { req }: MyContext,
  ): Promise<User[]> {
    return await UsersService.getUsers(req.company.id);
  }
}
