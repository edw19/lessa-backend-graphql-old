import { Types } from "mongoose"
import { IncomingMessage } from "http";

declare module "next" {
  export interface NextApiRequest extends IncomingMessage {
    user: {
      id: Types.ObjectId;
    };
    company: {
      id: Types.ObjectId;
    };
    establishment: {
      id: Types.ObjectId;
    };
    cashier: {
      id: Types.ObjectId;
    }
  }
}
