import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PercentProductsCategories {
  @Field({nullable: true})
  id: string

  @Field()
  name: string;

  @Field()
  totals: number;
}