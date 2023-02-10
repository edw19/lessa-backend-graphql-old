import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class SalesCharts {
    @Field()
    id: string

    @Field()
    createdAt: Date;

    @Field()
    total: string;
}