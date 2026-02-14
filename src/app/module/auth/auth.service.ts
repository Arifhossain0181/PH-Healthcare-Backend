
import { auth } from "../../lib/auth";


interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPaitent = async (payload:RegisterPatientPayload)=>{
    const {name,email,password} = payload;
    const data= await auth.api.signUpEmail({
        body:{
            name,
            email,
            password,
            //default values for additional fields
           // needsPasswordReset: false,
           // role:Role.PATIENT
        }

    })
  if(!data.user){
    throw new Error("User registration failed")
  }

  //todo: create patient profile in the database
  return data
}
export const authService = {
    registerPaitent
}