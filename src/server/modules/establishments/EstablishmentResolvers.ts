import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import type { MyContext } from '../../@types/MyContext';
import { CreateEstablishmentInput } from 'server/modules/establishments/inputs';
import { EstablishmentService } from 'server/modules/establishments/establishment.service';
import { Establishment } from 'server/modules/establishments/establishment.entity';

@Resolver()
export class EstablishmentResolvers {
  @Authorized('USER-OWNER')
  @Mutation(() => String, { nullable: true })
  async createEstablishment(
    @Arg('establishment', { nullable: true }) { address, phone }: CreateEstablishmentInput,
    @Ctx() { req }: MyContext
  ) {
    await EstablishmentService.create({
      companyId: req.company.id,
      userAdmin: req.user.id,
      phone,
      address,
    });
    return 'creada';
  }

  // Queries
  @Authorized('USER-OWNER')
  @Query(() => [Establishment])
  async getEstablishments(@Ctx() { req }: MyContext) {
    return await EstablishmentService.getEstablishments(req.company.id);
  }
}
