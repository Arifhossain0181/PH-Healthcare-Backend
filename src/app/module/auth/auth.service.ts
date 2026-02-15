
import { auth } from "../../lib/auth";
import { Role, UserStatus } from "../../../../prisma/generated/prisma/enums";


interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPaitent = async (payload:RegisterPatientPayload)=>{
    if (!payload?.name || !payload?.email || !payload?.password) {
        throw new Error('Name, email, and password are required');
    }
    const {name, email, password} = payload;
    const data= await auth.api.signUpEmail({
        body:{
            name,
            email,
            password,
            role: Role.PATIENT,
            status: UserStatus.ACTIVE,
            needPasswordReset: false,
            isDeleted: false
        }

    })
  if(!data.user){
    throw new Error("User registration failed")
  }

  //todo: create patient profile in the database
  return data
}
 
interface LoginPayload {
    email: string;
    password: string;
}

const login = async(payload: LoginPayload) => 
    {
        const {email, password} = payload;
    const result = await auth.api.signInEmail({
        body:{
            email,
            password}
    })
    if(result.user.status === UserStatus.BLOCKED){
        throw new Error("Your account is blocked. Please contact support.")
    }
    if(result.user.status === UserStatus.DELETED){
        throw new Error("Your account is deleted. Please contact support.")
    }
    return result;
}
export const authService = {
    registerPaitent,
    login   
}