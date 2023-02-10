import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class MostSelledProducts {
    @Field()
    name: string

    @Field()
    units: number
}
