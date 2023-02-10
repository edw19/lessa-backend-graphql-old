import { Resolver, Ctx, Mutation, Query, Arg } from "type-graphql";
import type { MyContext } from "server/@types/MyContext";
import { CreateTypeCashMovementsInput } from '../inputs/create-type-cash-movements.type'
import { TypeCashMovementsService } from "../services/type-cash-movements.service";
import { TypeCashMovements } from '../entities/type-cash-movements.entity'

@Resolver()
export class TypeCashMovementsResolver {
    @Query(() => [TypeCashMovements])
    async getTypeCashMovements(
        @Ctx() { req }: MyContext
    ) {
        return await TypeCashMovementsService.getAll({ company: req.company.id });
    };

    @Mutation(() => TypeCashMovements, { nullable: true })
    async createTypeCashMovement(
        @Arg("typeCashMovement") typeCashMovement: CreateTypeCashMovementsInput,
        @Ctx() { req }: MyContext
    ) {
        return await TypeCashMovementsService.create({
            ...typeCashMovement,
            company: req.company.id,
            establishment: req.establishment.id,
        });
    }
}