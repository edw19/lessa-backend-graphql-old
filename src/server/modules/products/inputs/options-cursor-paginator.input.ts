import { Field, InputType } from "type-graphql";

@InputType()
export class InputOptionsCursorPaginator {
    @Field({ nullable: true, })
    sortField: string;

    @Field({ nullable: true })
    sortAscending: boolean;

    @Field({ nullable: true })
    limit: number;

    @Field({ nullable: true })
    next?: string;

    @Field({ nullable: true })
    previous?: string;
}