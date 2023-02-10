import { ObjectType, Field } from "type-graphql";
import { prop } from "@typegoose/typegoose";

@ObjectType()
export class CreditHistory {
    @Field({ nullable: true })
    @prop()
    pay: boolean;

    @Field({ nullable: true })
    @prop()
    balance: number;

    @Field({ nullable: true })
    @prop()
    amount: number;

    @Field({ nullable: true })
    @prop()
    date: Date;
}