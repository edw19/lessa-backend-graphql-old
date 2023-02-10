import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { InputUserLogin } from "./Inputs";
import { JWT } from "../../../utils/jwt";
import type { MyContext } from "../../../@types/MyContext";
import { CompanyService } from "modules/companies/services/company.services";
import { setCookie } from 'server/utils/setCookie'
import { UsersService } from "../services/users.service";

@Resolver()
export class LoginResolvers {
  @Mutation(() => Boolean)
  async logIn(@Arg("user") user: InputUserLogin, @Ctx() { res }: MyContext) {

    try {
      const result = await UsersService.login(user.email, user.pwd);

      let payload: any = {};

      // if (result.role[0] === "USER-OWNER") {
      //   payload = {
      //     user: { id: result.id },
      //   };
      // }

      // if (result.role[0] === "USER-COMPANY") {

      //   const res = await CompanyService.getIdCompanyByUserAdmin(result.id);

      //   payload = {
      //     user: { id: result.id },
      //     company: { id: res?.id },
      //   };
      // }

      // const { accessToken, refreshToken } = JWT.createTokens(payload);

      // setCookie(res, [
      //   `access-token=${accessToken}`,
      //   `refresh-token=${refreshToken}`,
      // ]);

      return true;
    } catch (error) {
      return false
    }
  }
}
