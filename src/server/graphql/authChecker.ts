import { AuthChecker } from "type-graphql";
import { MyContext } from "../@types/MyContext";

const MESSAGE_ERROR_UNAUTHENTICATE = "Debes iniciar sesión authChecker";

export const authChecker: AuthChecker<MyContext> = async (
  { context },
  roles
) => {
  return true;
};
