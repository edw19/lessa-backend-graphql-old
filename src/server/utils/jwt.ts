import { sign, verify } from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } from "config/variables";
import { ObjectId } from "mongodb";
import { UsersService } from "server/modules/users/services/users.service";

interface IPayload {
  user: {
    id: ObjectId;
  };
  company: {
    id: ObjectId;
  };
  establishment?: {
    id: string;
  };
}

interface IPayloadTokenRefresh {
  user: {
    id: ObjectId;
  };
}

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export class JWT {
  static createTokens(payload: IPayload): ITokens {
    const accessToken = sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    const refreshToken = sign(
      {
        user: {
          id: payload.user.id,
        },
      },
      REFRESH_TOKEN_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    return { accessToken, refreshToken };
  }

  static async verifyAccessToken(accessToken: string): Promise<IPayload> {
    try {
      const payload = verify(accessToken, ACCESS_TOKEN_SECRET) as IPayload;
      if (!(await UsersService.userExists(payload.user.id))) {
        throw new Error("Usuario no registrado");
      }
      return payload;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  static async verifyRefreshToken(
    refreshToken: string
  ): Promise<IPayloadTokenRefresh> {
    try {
      const payload = verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      ) as IPayloadTokenRefresh;
      if (!(await UsersService.userExists(payload.user.id))) {
        throw new Error("Usuario no registrado");
      }
      return payload;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  static verifyAccessTokenForRefresh(accessToken: string): Boolean {
    try {
      verify(accessToken, ACCESS_TOKEN_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
}
