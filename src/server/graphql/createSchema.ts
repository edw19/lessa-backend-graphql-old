import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "./object-id-scalar";
import { buildSchemaSync } from "type-graphql";
// middlewares
import { authChecker } from "./authChecker";
// users
// import { RegisterResolvers } from "server/modules/users/RegisterResolvers";
// import { LoginResolvers } from "server/modules/users/unused/LoginResolvers";
// import { UserResolver } from "server/modules/users/unused/UserResolver";
// import { LogoutResolvers } from "server/modules/users/LogoutResolvers";
import { UserResolver } from "../modules/users/resolvers/user-resolvers";

// companies
import { CompanyMutationResolvers } from "../modules/companies/resolvers/company-mutations-resolvers";
import { CompanyQueriesResolvers } from "../modules/companies/resolvers/company-queries-resolvers";

// establishments
import { EstablishmentResolvers } from "server/modules/establishments/EstablishmentResolvers";

// buys
import { BuysMutationResolver } from "../modules/buys/BuysMutationResolver";
import { BuysQueryResolver } from "../modules/buys/BuysQueryResolvers";
// products
import { ProductsQueryResolver } from "../modules/products/resolvers/products-queries.resolvers";
import { ProductsMutationResolver } from "server/modules/products/resolvers/products-mutations.resolvers";

// sales
import { SalesQueryResolver } from "../modules/sales/SalesQueryResolver";
import { SalesMutationResolver } from "../modules/sales/SalesMutationResolver";

// categories
import { CategoriesResolver } from "../modules/categories/categories.resolvers";

// clients
import { ClientsQueryResolver } from "../modules/clients/ClientsQueryResolver";
import { ClientsMutationResolver } from "../modules/clients/ClientsMutationResolver";

import {
  VendorsResolver
} from "../modules/vendors/vendors.resolver";

// billing
import { BillingResolver } from "../modules/billing/BillingResolver";

// cash movements
import { CashMovementsResolver } from "../modules/cash_movements/resolvers/cash-movements.resolver";
import { TypeCashMovementsResolver } from "../modules/cash_movements/resolvers/type-cash-movements.resolver";

// cashier 
import { CashierResolver } from "../modules/cashiers/resolvers/cashier.resolver";
import { TypegooseMiddleware } from "./typegoose-middleware";

export const createSchema = () => buildSchemaSync({
  resolvers: [
    // RegisterResolvers,
    // LoginResolvers,
    UserResolver,
    // LogoutResolvers,
    EstablishmentResolvers,
    BuysMutationResolver,
    BuysQueryResolver,
    ProductsQueryResolver,
    ProductsMutationResolver,
    SalesQueryResolver,
    SalesMutationResolver,
    CategoriesResolver,
    ClientsQueryResolver,
    ClientsMutationResolver,
    VendorsResolver,
    BillingResolver,
    CompanyMutationResolvers,
    CompanyQueriesResolvers,
    // UserResolvers,
    CashMovementsResolver,
    TypeCashMovementsResolver,
    CashierResolver,
  ],
  authChecker,
  // globalMiddlewares: [TypegooseMiddleware],
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  dateScalarMode: 'isoDate',
  validate: false,
});
