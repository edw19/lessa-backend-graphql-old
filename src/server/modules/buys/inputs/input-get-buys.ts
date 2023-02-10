import { Field, InputType, Int } from "type-graphql";

@InputType()
export class InputGetBuys {
  @Field()
  queryBy: string;

  @Field({ nullable: true })
  credit: boolean;

  @Field({ nullable: true })
  startDate: Date

  @Field({ nullable: true })
  endDate: Date

  @Field({ nullable: true })
  vendor: string;
}