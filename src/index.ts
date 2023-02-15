import "reflect-metadata"
import http from 'http'
import express from 'express'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createConnection } from './server/utils/createConnection'
import { createSchema } from "./server/graphql/createSchema"
import { UsersService } from "server/modules/users/services/users.service"
import { CompanyModel } from "server/modules/companies/entities"
import { EstablishmentService } from "server/modules/establishments/establishment.service"
import { CashierService } from "server/modules/cashiers/services/cashier.service"
import { expressMiddleware } from "@apollo/server/express4"
import { decode } from 'next-auth/jwt'
import cors from 'cors'
import cookies from 'cookie-parser'
import { json } from 'body-parser'

const PORT = process.env.PORT || 4000;
const GRAPHQL_PATH = "/api/graphql";


async function main() {
    await createConnection()

    const app = express();
    const httpServer = http.createServer(app);

    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await apolloServer.start();

    app.use(
        GRAPHQL_PATH,
        cors({
            origin: ['http://localhost:3000', "https://www.lessa.app/", "https://lessa.vercel.app/"],
            credentials: true,
        }),
        cookies(),
        json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => {
                try {
                    const secretKey = 'my-super-secret-key';
                    const token = req.headers.cookie?.split(" ")[2].replace("next-auth.session-token=", "")
                    const payload = await decode({ secret: secretKey, token: token! })

                    if (!payload) return { req, res }

                    const userId = payload?.sub! as any;

                    const currentUser = await UsersService.getUser(userId);
                    // if user is a cashier
                    if (currentUser && currentUser.role.includes("USER-CASHIER")) {
                        //@ts-ignore
                        req.user = { id: currentUser.id };
                        //@ts-ignore
                        req.company = { id: currentUser.company! };
                        //@ts-ignore
                        req.establishment = { id: currentUser.establishment! };
                        //@ts-ignore
                        req.cashier = { id: currentUser.cashier! };
                    } else {

                        const company = await CompanyModel.findOne({ userOwner: userId })
                        const establishment = await EstablishmentService.getMainEstablishment(company!.id)
                        const cashier = await CashierService.getCashierByUserId(userId);

                        if (userId && company && establishment && cashier) {
                            //@ts-ignore
                            req.user = { id: userId };
                            //@ts-ignore
                            req.company = { id: company.id };
                            //@ts-ignore
                            //@ts-ignore
                            req.establishment = { id: establishment.id };
                            //@ts-ignore
                            req.cashier = { id: cashier.id };
                        }
                    }
                    return { req, res };
                } catch (error) {
                    console.log({ error })
                    return { req, res }
                }
            },
        })
    );

    httpServer.listen({ port: PORT }, () => {
        console.log(`Server started at http://localhost:${PORT}${GRAPHQL_PATH}`);
    });
}

main()
