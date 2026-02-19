import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createtoken =(payload:JwtPayload, secret: string, {expiresIn} :SignOptions )=>{
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
}

const verifytoken =(token: string, secret: string)=>{
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return{
            success: true,
            message: "Token is valid",
            decoded
        }
    } catch (error : unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Invalid token",
            error
        }
    }
}

const decodetoken =(token :string)=>{
    const decoded = jwt.decode(token) as JwtPayload;
    return {
        success: true,
        message: "Token decoded successfully",
        decoded
    }
}
const jwtUtils = {
    createtoken,
    verifytoken,
    decodetoken
}

export default jwtUtils;
