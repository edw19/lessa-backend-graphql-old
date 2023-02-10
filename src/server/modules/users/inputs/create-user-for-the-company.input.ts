import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserForTheCompanyInput {
    @Field()
    username: string;

    @Field()
    pwd: string;

    @Field(() => [String])
    role: string[];
}