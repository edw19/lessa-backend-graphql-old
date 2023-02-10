import { Types } from "mongoose"
import type { MyContext } from "server/@types/MyContext";
import { Arg, Ctx, Query, Resolver, Mutation, InputType, Field } from "type-graphql";
import { Cashier } from "../entities/cashier.entity";
import { CashierService } from "../services/cashier.service";


@InputType()
class UpdateCashInput {
    @Field({ nullable: true })
    cashMovementName?: string;

    @Field({ nullable: true })
    typeCashMovementsId: Types.ObjectId;

    @Field()
    amount: number;
}

@Resolver()
export class CashierResolver {
    @Query(() => Cashier)
    async getCashier(@Ctx() { req }: MyContext) {
        return await CashierService.getOne(req.cashier.id)
    }
    @Query(() => [Cashier])
    async getCashiers(@Ctx() { req }: MyContext) {
        return await CashierService.getALl(req.establishment.id)
    }

    @Mutation(() => Number)
    async updateCash(
        @Arg("updateCash") updateCash: UpdateCashInput,
        @Ctx() { req }: MyContext) {
        return await CashierService.updateCash({
            ...updateCash,
            cashierId: req.cashier.id,
            company: req.company.id,
        })
    }
}