import { ObjectId } from "mongodb";
import { IncomingMessage } from "http";

declare module "next" {
  export interface NextApiRequest extends IncomingMessage {
    user: {
      id: ObjectId;
    };
    company: {
      id: ObjectId;
    };
    establishment: {
      id: ObjectId;
    };
    cashier: {
      id: ObjectId;
    }
  }
}
