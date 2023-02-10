import { registerEnumType } from "type-graphql";

export enum TARIFF_IVA {
    CERO_PORCIENTO,
    GRAVA_IVA,
    NO_OBJETO_DE_IMPUESTO,
    EXENTO_DE_IVA
}

registerEnumType(TARIFF_IVA, {
    name: "TariffIva",
    description: "Tarifas vigentes en el sri"
})