import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Pagination {
    @Field()
    hasNext: boolean;

    @Field()
    hasPrevious: boolean;

    @Field({ nullable: true })
    next: string;

    @Field({ nullable: true })
    previous: string;

    @Field()
    totalDocs: number;
}