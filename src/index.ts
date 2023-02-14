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
import cookies from 'cookie-parser'
import { decode } from 'next-auth/jwt'

const app = express();
const PORT = process.env.PORT || 4000;



async function main() {
    await createConnection()
    
    app.use(cookies())
    const httpServer = http.createServer(app);
    
    
    const server = new ApolloServer({
        schema: createSchema(),
        csrfPrevention: true,
        cache: 'bounded',
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true })
        ],
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
            }
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

    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}/api/graphql`);
}

main()
