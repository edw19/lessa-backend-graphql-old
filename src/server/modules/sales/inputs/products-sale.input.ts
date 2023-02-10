import { Field, InputType } from "type-graphql";
import { InputAdditionalInformation, InputTaxes } from "server/modules/products/inputs";

@InputType()
export class ProductsSaleInput {
    @Field(() => String)
    id: string;

    @Field()
    kind: string;

    @Field()
    code: string;

    @Field()
    units: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    priceBuy: number;

    @Field()
    priceSale: number;

    @Field({ nullable: true })
    iva: boolean;

    @Field({ nullable: true })
    description: string;

    @Field(() => InputTaxes)
    taxes: InputTaxes;

    @Field(() => [InputAdditionalInformation])
    additionalInformation?: InputAdditionalInformation[];
}
