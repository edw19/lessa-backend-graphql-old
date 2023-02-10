import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCashMovementInput {
    @Field(() => ObjectId, { nullable: true })
    transactionId?: ObjectId;

    @Field({ nullable: true })
    cashMovementName?: string;

    @Field({ nullable: true })
    typeCashMovementsId?: ObjectId;

    @Field()
    amount: number;

    @Field()
    description: string;

    @Field()
    createdAt: Date;
}