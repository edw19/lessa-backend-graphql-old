import { Ctx, Query, Resolver, Mutation, Arg } from "type-graphql";
import { User } from 'modules/users/entities';
import type { MyContext } from "server/@types/MyContext";
import { UsersService } from "../services/users.service";
import { UserRegisterInput } from "../inputs/user-register.input";
import { CreateUserForTheCompanyInput } from "../inputs/create-user-for-the-company.input";
import {} from 'modules/users/entities'

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async getUsers(
        @Ctx() { req }: MyContext,
    ): Promise<User[]> {
        return await UsersService.getUsers(req.company.id);
    }

    @Mutation(() => String)
    async registerUser(
        @Arg("user") user: UserRegisterInput,
    ): Promise<string> {
        console.log({ user })

        return await UsersService.getStartedUser(user);
    }

    @Mutation(() => User)
    async createUserForTheCompany(
        @Arg("user") user: CreateUserForTheCompanyInput,
        @Ctx() { req }: MyContext,
    ) {
        return await UsersService.createUserForTheCompany(
            {
                company: req.company.id,
                establishment: req.establishment.id,
                cashier: req.cashier.id,
                username: user.username,
                pwd: user.pwd,
                role: user.role,
            }
        )
    }
}
