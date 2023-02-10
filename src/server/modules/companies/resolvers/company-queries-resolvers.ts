import { Int, Query, Arg, Authorized, Ctx, Resolver } from 'type-graphql'
import { Company } from "../entities/company.entity";
import type { MyContext } from "server/@types/MyContext";
import { CompanyService } from "server/modules/companies/services/company.services";

@Resolver()
export class CompanyQueriesResolvers {
    @Authorized("USER-OWNER", "USER-COMPANY")
    @Query(() => String)
    async getTradeName(
        @Ctx() { req }: MyContext
    ) {
        return await CompanyService.getTradeName(req.company!.id);
    }

    @Authorized("USER-OWNER", "USER-COMPANY")
    @Query(() => Company)
    async getCompany(@Ctx() { req }: MyContext) {
        return await CompanyService.getCompany(req.company!.id);
    }

    @Query(() => [Company], { nullable: false })
    @Authorized("USER-OWNER")
    async getCompanies(@Ctx() ctx: MyContext) {
        const companies = await CompanyService.getCompanies(ctx.req.user.id);
        return companies;
    }

    @Query(() => Int, { nullable: false })
    async getTotalCompaniesRegistered() {
        return await CompanyService.countCompaniesRegistered();
    }
}