import { Field, InputType } from "type-graphql";

@InputType()
export class InputCredit {
    @Field()
    client: string;

    @Field()
    total: string;
}
