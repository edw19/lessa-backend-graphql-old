import type { MyContext } from "server/@types/MyContext";
import { Authorized, Ctx, Mutation, Resolver } from "type-graphql";
// import { serialize } from "cookie";

@Resolver()
export class LogoutResolvers {
  @Authorized("USER-OWNER", "USER-COMPANY")
  @Mutation(() => Boolean)
  async logoutUser(@Ctx() { req, res }: MyContext) {
    // @ts-ignore
    req.user.id = "";
    if (req.company?.id) {
      // @ts-ignore
      req.company!.id = "";
    }
    // res.setHeader("Set-Cookie", [
    //   serialize("access-token", "", {
    //     maxAge: -1,
    //     path: "/",
    //   }),
    //   serialize("accessToCompanyFromOwner", "", {
    //     maxAge: -1,
    //     path: "/",
    //   }),
    //   serialize("refresh-token", "", {
    //     maxAge: -1,
    //     path: "/",
    //   }),
    // ]);
    return true;
  }
}
