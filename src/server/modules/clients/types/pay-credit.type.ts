import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class PayCreditType {
    @Field()
    id: string;

    @Field()
    credit: number;
}