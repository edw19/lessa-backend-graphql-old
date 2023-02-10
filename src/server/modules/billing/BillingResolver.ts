import type { MyContext } from "server/@types/MyContext";
import { Authorized, Ctx, Field, Query, ObjectType, Resolver } from "type-graphql";
import { BillingElectronic } from "./services/billing-electronic.service";

@ObjectType()
class MethosBilling {
  @Field()
  name: string

  @Field()
  active: boolean
}

@Resolver()
export class BillingResolver {
  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => [MethosBilling])
  async methodsForBilling(@Ctx() { req }: MyContext) {
    const methods: any = [];
    const isValidate = await BillingElectronic.validateFieldsNecessayForBillingElectronic(req.company.id);

    if (isValidate) {
      methods.push({ name: "electronic", active: false })
    }

    return methods.length > 0 ? methods : [];
  }
}
