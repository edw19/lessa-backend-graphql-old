import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import type { MyContext } from "../../@types/MyContext";
import { CompanyService } from "./services/company.services";
import { InputAddSignature, InputCreateCompany } from "./InputsCompany";
// import { CompanyService } from "../../services/companies";
import { Company } from "modules/companies/entities";
import { JWT } from "server/utils/jwt";
import { setCookie } from "server/utils/setCookie";

@Resolver()
export class CompanyResolvers {

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => String)
  async getTradeName(
    // @Arg("accessToken", { nullable: true }) accessToken: string,
    // @Arg("refreshToken", { nullable: true }) refreshToken: string,
    @Ctx() { req }: MyContext
  ) {
    // if (!accessToken) throw new Error("TradeName");
    // const payload = await JWT.verifyAccessToken(accessToken);
    return await CompanyService.getTradeName(req.company.id);
  }

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => Company)
  async getCompany(
    @Arg("id", { nullable: true }) id: string,
    @Ctx() { req }: MyContext
  ) {
    const company = await CompanyService.getCompany(req.company.id);
    return company;
  }

  @Query(() => [Company], { nullable: false })
  @Authorized("USER-OWNER")
  async getCompanies(@Ctx() ctx: MyContext) {
    const companies = await CompanyService.getCompanies(ctx.req.user.id);
    return companies;
  }

  // mutations
  // @Authorized("USER-OWNER")
  // @Mutation(() => Company, { nullable: true })
  // async createCompany2(
  //   @Arg("company") company: InputCreateCompany,
  //   @Ctx() { res, req }: MyContext
  // ) {
  //   if (req.user?.id) {
  //     const newCompany = await CompanyService.createCompany(
  //       company,
  //       req.user.id
  //     );
  //     return newCompany;
  //   }
  //   const newCompany = await CompanyService.createCompany(company);
  //   const { accessToken, refreshToken } = JWT.createTokens({
  //     user: { id: company.userAdmin },
  //     company: { id: newCompany.id },
  //   });

  //   setCookie(res, [
  //     `access-token=${accessToken}`,
  //     `refresh-token=${refreshToken}`,
  //   ]);
  //   return res;
  // }
  //   setCookie(res, [
  //     `access-token=${accessToken}`,
  //     `refresh-token=${refreshToken}`,
  //   ]);
  //   return res;
  // }
}
