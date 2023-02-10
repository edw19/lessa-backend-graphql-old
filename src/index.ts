import "reflect-metadata";
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { createConnection } from './server/utils/createConnection';
import { createSchema } from "./server/graphql/createSchema";
import { UsersService } from "server/modules/users/services/users.service";
import { CompanyModel } from "server/modules/companies/entities";
import { EstablishmentService } from "server/modules/establishments/establishment.service";
import { CashierService } from "server/modules/cashiers/services/cashier.service";
import cors from 'cors'

const app = express();
const httpServer = http.createServer(app);

async function main() {
    await createConnection()
    const server = new ApolloServer({
        schema: createSchema(),
        csrfPrevention: true,
        cache: 'bounded',
        introspection: process.env.NODE_ENV !== 'production',
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true })
        ],
        context: async ({ req, res }) => {
            // if (req?.cookies?.ssr || Object.keys(req.cookies).length === 0) {
            //     const cookies = JSON.parse(req.headers.cookie!);
            //     req.cookies = cookies;
            // }
            // const token = await getToken({ req, secret: "my-super-secret-key" })

            // if (token) {
            const userId: any = "63083b83c028fca66f5b4155";
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
            // }

            // @ts-ignore
            console.log({ user: req.user })
            return { req, res };
        },
    });
    await server.start()

    server.applyMiddleware({
        app,
        path: '/api/graphql',
        cors: {
            origin: 'http://localhost:3000',
            credentials: true
        }
    })

    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))
    console.log(`🚀 Server ready at http://localhost:4000/api/graphql`);
}

main()
