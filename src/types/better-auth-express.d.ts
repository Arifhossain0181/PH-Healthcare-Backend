declare module "better-auth/express" {
  import { RequestHandler } from "express";
  import { BetterAuth } from "better-auth";
  export function toNodeHandler(auth: BetterAuth): RequestHandler;
}
