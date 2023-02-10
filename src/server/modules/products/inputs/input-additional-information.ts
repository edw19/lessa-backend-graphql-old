import { Field, InputType } from "type-graphql";

@InputType()
export class InputAdditionalInformation {
  @Field()
  name: string;

  @Field()
  value: string;
}