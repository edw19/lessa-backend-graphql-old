import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTypeCashMovementsInput {
    @Field()
    name: string;

    @Field()
    isExpense: boolean;
}