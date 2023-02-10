import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ClientCredit {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    credit: number;
}