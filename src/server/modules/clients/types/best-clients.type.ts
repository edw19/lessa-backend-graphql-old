import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class BestClients {
    @Field({ nullable: true })
    _id: string;

    @Field({ nullable: true })
    client: string;

    @Field({ nullable: true })
    total: number;
}