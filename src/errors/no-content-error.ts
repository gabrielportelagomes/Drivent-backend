import { ApplicationError } from "@/protocols";

export function noContentError(): ApplicationError {
  return {
    name: "noContentError",
    message: "Cannot acess the information!",
  };
}
