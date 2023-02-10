import { UserModel } from "modules/users/entities";
import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb";
import { USER_ADMIN_COMPANY } from "server/services/roles";
import { UserRegisterInput } from "../inputs/user-register.input";
import { CompanyService } from "server/modules/companies/services/company.services";
import { EstablishmentService } from "server/modules/establishments/establishment.service";
import { generateObjectId } from "server/utils/generateId";
import { CashierService } from "server/modules/cashiers/services/cashier.service";
import { TypeCashMovementsService } from "server/modules/cash_movements/services/type-cash-movements.service";

type CreateUserForTheCompanyProps = {
    company: ObjectId;
    establishment: ObjectId;
    cashier: ObjectId;
    username: string;
    pwd: string;
    role: string[];
};

export class UsersService {
    static async createUserForTheCompany(user: CreateUserForTheCompanyProps) {
        const userExist = await UserModel.findOne({ username: user.username, company: user.company });
        if (userExist) {
            throw new Error("EL nombre de usuario ya esta en uso");
        }
        const salt = await bcrypt.genSalt(10);
        user.pwd = await bcrypt.hash(user.pwd, salt);
        return await UserModel.create(user)
    }

    static async getUsers(company: ObjectId) {
        return await UserModel.find({ company });
    }

    static async login(email: string, pwd: string) {
        // is email function 
        let query = {};
        if (email.includes("@")) {
            query = { email };
        } else {
            query = { username: email };
        }


        const user = await UserModel.findOne(query);
        if (!user) {
            throw new Error("Usuario no existe");
        }
        if (await bcrypt.compare(pwd, user.pwd)) {
            return await UsersService.getUser(user.id);
        }
        throw new Error("Credeciales Inválidas");
    }

    static async getUser(id: ObjectId) {
        return await UserModel.findById(id).select("-pwd");
    }

    static async registerUser(user: any) {
        try {
            const userExist = await UserModel.findOne({ email: user.email });
            if (userExist) {
                throw new Error("EL email ya esta asociado a una cuenta");
            }
            const salt = await bcrypt.genSalt(10);
            user.pwd = await bcrypt.hash(user.pwd, salt);
            user.role = USER_ADMIN_COMPANY;
            return await UserModel.create(user);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    static async getRoleUser(id: string) {
        const user = await UserModel.findById(id).select("role -_id");
        return user!.role;
    }

    static async userExists(id: ObjectId | null) {
        const user = await UserModel.findById(id);
        if (!user) return false;
        return true;
    }

    static async getStartedUser({ tradename, ...user }: UserRegisterInput) {
        const newUser = await UsersService.registerUser(user);
        // const defaultTradename = newUser.username!.toLowerCase().trim().split(" ")[0]
        const newCompany = await CompanyService.createCompany({ userOwner: newUser.id, tradename })
        const newEstablishment = await EstablishmentService.create({
            companyId: newCompany.id,
            userAdmin: generateObjectId(newUser.id),
        })
        // as firts register user admin must be have a cashier for show system app this is cashier by default and
        // his value is 1 that means than is firts cashier of the company
        await CashierService.create({
            establishment: newEstablishment.id,
            cashierUserId: newUser.id,
            emissionPoint: 1,
        })

        // this is required for cashier movements works
        // create type cashier movement called "ventas"
        // create type cashier movement called "compras"
        await TypeCashMovementsService.create({
            company: newCompany.id,
            establishment: newEstablishment.id,
            name: "Ventas",
            isExpense: false,
            showInList: false
        })
        await TypeCashMovementsService.create({
            company: newCompany.id,
            establishment: newEstablishment.id,
            name: "Compras",
            isExpense: true,
            showInList: false
        })
        await TypeCashMovementsService.create({
            company: newCompany.id,
            establishment: newEstablishment.id,
            name: "Restaurar",
            isExpense: true,
            showInList: false
        })
        return newUser.id;
    }

}

// previous servicios 
// static async createUserCompany(user: any, userOwner: ObjectId) {
//     try {
//       const userExist = await UserModel.findOne({ email: user.email });
//       if (userExist) {
//         throw new Error("EL email ya esta asociado a una cuenta");
//       }
//       const salt = await bcrypt.genSalt(10);
//       user.pwd = await bcrypt.hash(user.pwd, salt);
//       user.role = USER_ADMIN_COMPANY;
//       user.userOwner = userOwner;
//       const userCreated = await UserModel.create(user);
//       await CompanyModel.findByIdAndUpdate(user.company, {
//         userAdmin: userCreated.id,
//       });
//     } catch (error: any) {
//       throw new Error(error);
//     }
//   }
// static async createUserEstablishment(user: any) {
//     try {
//       const userExist = await UserModel.findOne({ email: user.email });
//       if (userExist) {
//         throw new Error("EL email ya esta asociado a una cuenta");
//       }
//       const salt = await bcrypt.genSalt(10);
//       user.pwd = await bcrypt.hash(user.pwd, salt);
//       user.role = USER_ADMIN_ESTABLISHMENT;
//       return await UserModel.create(user);
//     } catch (error: any) {
//       throw new Error(error);
//     }
//   }

// @Mutation(() => User)
// async createUserForTheCompany(
//     @Arg("user") user: CreateUserForTheCompanyInput,
//     @Ctx() { req }: MyContext,
// ) {
//     return await UsersService.createUserForTheCompany(
//         {
//             company: req.company.id,
//             establishment: req.establishment.id,
//             cashier: req.cashier.id,
//             username: user.username,
//             pwd: user.pwd,
//             role: user.role,
//         }
//     )
// }