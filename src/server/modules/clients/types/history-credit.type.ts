import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class HistoryCredit {
    @Field({ nullable: true })
    pay: boolean;

    @Field({ nullable: true })
    balance: string;

    @Field({ nullable: true })
    amount: string;

    @Field({ nullable: true })
    date: Date;
}