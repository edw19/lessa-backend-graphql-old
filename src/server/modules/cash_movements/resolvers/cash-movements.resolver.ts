import type { MyContext } from "server/@types/MyContext";
import { Arg, Ctx, Mutation, Resolver, Query, FieldResolver, Root } from "type-graphql";
import { CreateCashMovementInput } from "../inputs/create-cash-movement.input";
import { CashMovementsService } from "../services/cash-movements.service";
import { CashMovements } from "../entities/cash-movements.entity";
import { TypeCashMovements } from "../entities/type-cash-movements.entity";
import { TypeCashMovementsService } from "../services/type-cash-movements.service";

@Resolver(() => CashMovements)
export class CashMovementsResolver {
    @Query(() => [CashMovements])
    async getCashMovements(
        @Arg("queryBy") queryBy: string,
        @Ctx() { req }: MyContext) {
        return await CashMovementsService.getAll({ company: req.company.id, queryBy })
    }

    @Mutation(() => Number, { nullable: true })
    async createCashMovement(
        @Arg("cashMovement") cashMovement: CreateCashMovementInput,
        @Ctx() { req }: MyContext
    ) {
        await CashMovementsService.create({
            ...cashMovement,
            company: req.company.id,
            establishment: req.establishment.id
        });
    }

    @FieldResolver(() => TypeCashMovements)
    async typeCashMovement(@Root() { typeCashMovementsId }: CashMovements) {
        return await TypeCashMovementsService.getOne({ id: typeCashMovementsId! })
    }
}