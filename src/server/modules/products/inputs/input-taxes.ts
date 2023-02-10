import { Field, InputType } from "type-graphql";

@InputType()
export class InputTaxes {
    @Field()
    iva: string;

    @Field({ nullable: true })
    ice?: string;

    @Field({ nullable: true })
    irbpnr?: string;
}

// tarifa porcentaje iva ==== codigo
// const TARIFF_IVA = {
//     "0%": 0,
//     "12%": 2,
//     "14%": 3, // 14 no aplica
//     "No Objecto de Impuesto": 6,
//     "Exento de IVA": 7
//   }
