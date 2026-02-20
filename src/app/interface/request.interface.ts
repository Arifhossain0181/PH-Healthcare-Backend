import { Role } from "../../../prisma/generated/prisma";


export interface IRequest {
    userId: string;
    role:Role,
    email: string;
}