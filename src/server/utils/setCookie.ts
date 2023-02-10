import type { NextApiResponse } from "next";
import { serialize, CookieSerializeOptions } from "cookie";

export function setCookie(
  res: NextApiResponse,
  value: string[],
  // value: unknown,
  options: CookieSerializeOptions = {}
) {
  options.secure = true;
  options.httpOnly = process.env.NODE_ENV === "production";
  options.path = "/";

  const cookies = value.map((cookie) => {
    const values = cookie.split("=");
    const value = serialize(values[0], String(values[1]), options);
    return value;
  });
  res.setHeader("Set-Cookie", cookies);
}
