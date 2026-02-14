import { Specialty } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createSpeciality = async ( payload :Specialty) : Promise<Specialty> => {
    const speciality = await prisma.specialty.create({
        data: payload
    })
    return speciality
}
const getAllSpeciality = async () : Promise<Specialty[]> => {
    const speciality = await prisma.specialty.findMany()
    return speciality
}
const deleteSpeciality = async (id : string) : Promise<Specialty> => {
    const speciality = await prisma.specialty.delete({
        where: {id}
    })
    return speciality
}
const updateSpeciality = async (id : string, payload : Specialty) : Promise<Specialty> => {
    const speciality = await prisma.specialty.update({
        where: {id},
        data: payload
    })
    return speciality
}
   
    export const specialityService = {
        createSpeciality,
        getAllSpeciality,
        deleteSpeciality,
        updateSpeciality
    }

