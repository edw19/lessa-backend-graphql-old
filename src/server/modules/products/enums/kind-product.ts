import { registerEnumType } from "type-graphql";

export enum KindProduct {
    SERVICE,
    GOOD
}

registerEnumType(KindProduct, {
  name: "KindProduct",
  description: "Tipo de productos servicio y bien",
});