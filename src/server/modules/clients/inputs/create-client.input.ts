import { Field, InputType } from "type-graphql";

@InputType()
export class InputClient {
    @Field()
    identificationCard: string;

    @Field({ nullable: true })
    email: string;

    @Field()
    name: string;

    @Field()
    lastName: string;

    @Field()
    phone: string;

    @Field()
    address: string;
}