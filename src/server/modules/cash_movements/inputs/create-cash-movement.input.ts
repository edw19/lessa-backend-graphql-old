import { Types } from "mongoose"
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCashMovementInput {
    @Field(() => Types.ObjectId, { nullable: true })
    transactionId?: Types.ObjectId;

    @Field({ nullable: true })
    cashMovementName?: string;

    @Field({ nullable: true })
    typeCashMovementsId?: Types.ObjectId;

    @Field()
    amount: number;

    @Field()
    description: string;

    @Field()
    createdAt: Date;
}