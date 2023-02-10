import { Authorized, Ctx, Mutation, Query, Resolver, Arg } from "type-graphql";
import type { MyContext } from "../../../@types/MyContext";
import { InputUserCompany, InputUserEstablishment } from "./Inputs";
import { User, UserModel } from "modules/users/entities";
import { CompanyModel } from "modules/companies/entities";
import { mongoose } from "@typegoose/typegoose";
import { JWT } from "server/utils/jwt";
// import { setCookie } from "server/utils/setCookie";
import { Types } from "mongoose"
import { UsersService } from "../services/users.service";

@Resolver()
export class UserResolver {

  @Authorized("USER-OWNER", "USER-COMPANY")
  @Query(() => User)
  async getUserToday(@Ctx() { req }: MyContext) {

    const res = await UsersService.getUser(req.user.id)

    return res


  }

  @Authorized("USER-OWNER")
  @Mutation(() => User, {
    nullable: true,
  })
  async createUserCompany(
    @Arg("userCompany") userCompany: InputUserCompany,
    @Ctx() ctx: MyContext
  ) {
    // const user = await UsersService.createUserCompany(
    //   userCompany,
    //   ctx.req.user.id
    // );
    // return user;
  }

  @Authorized(["USER-OWNER", "USER-COMPANY"])
  @Mutation(() => User, {
    nullable: true,
    description: "esta es la decripcion del get User",
  })
  async createUserEstablishment(
    @Arg("userEstablishment") userEstablishment: InputUserEstablishment,
  ) {
    // const user = await UserService.createUserEstablishment(userEstablishment);
    // return user;
  }

  @Authorized("USER-COMPANY")
  @Mutation(() => Boolean)
  async updateMultiCompanies(@Ctx() ctx: MyContext) {
    // update rol user
    await UserModel.findByIdAndUpdate(
      ctx.req.user.id,
      {
        $set: { role: "USER-OWNER", multiCompanies: true },
      },
      { new: true }
    );
    // update userOwner and usrAdmin for Companies
    await CompanyModel.findByIdAndUpdate(ctx.req.company!.id, {
      $set: { userOwner: new mongoose.Types.ObjectId(ctx.req.user.id) },
    });

    let payload: any = {
      user: { id: ctx.req.user.id },
    };

    const { accessToken, refreshToken } = JWT.createTokens(payload);
    // setCookie(ctx.res, [
    //   `access-token=${accessToken}`,
    //   `refresh-token=${refreshToken}`,
    // ]);

    return true;
  }

  @Authorized("USER-OWNER")
  @Mutation(() => Boolean)
  accessToCompanyFromOwner(
    @Arg("company") company: Types.ObjectId,
    @Ctx() ctx: MyContext
  ): Boolean {
    const { accessToken, refreshToken } = JWT.createTokens({
      user: ctx.req.user,
      company: { id: company },
    });
    // setCookie(ctx.res, [
    //   `accessToCompanyFromOwner=${true}`,
    //   `access-token=${accessToken}`,
    //   `refresh-token=${refreshToken}`,
    // ]);
    return true;
  }
  @Authorized("USER-OWNER")
  @Mutation(() => Boolean)
  async returnFromCompanyToOwner(@Ctx() { req, res }: MyContext) {
    //@ts-ignore
    const { accessToken, refreshToken } = JWT.createTokens({
      user: req.user,
    });

    // setCookie(res, [
    //   `access-token=${accessToken}`,
    //   `refresh-token=${refreshToken}`,
    // ]);

    return true;
  }
}
