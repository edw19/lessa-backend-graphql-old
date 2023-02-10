import { Field, InputType } from "type-graphql";

@InputType()
export class InputVendor {
  @Field()
  name: string;

  @Field()
  ruc: string;

  @Field()
  phone: string;
}
