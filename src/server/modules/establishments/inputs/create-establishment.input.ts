import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateEstablishmentInput {
    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    phone?: string;
}
