import { IRequest } from "./request.interface";


declare global {
    namespace Express {
        interface Request {
            user:IRequest
        }
    }
}