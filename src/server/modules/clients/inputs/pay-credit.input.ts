import { Field, InputType } from "type-graphql";

@InputType()
export class InputPayCredit {
    @Field()
    client: string;

    @Field()
    payAmount: number;

    @Field()
    total: number;

    @Field()
    date: Date;
}