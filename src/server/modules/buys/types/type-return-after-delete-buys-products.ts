import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class ReturnAfterDeleteBuysProducts {
  @Field()
  id: string;

  @Field(() => Int)
  stock: number;
}