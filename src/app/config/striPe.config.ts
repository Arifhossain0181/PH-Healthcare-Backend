import { envVars } from "./env";
import Stripe from "stripe";

export const striPe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY)