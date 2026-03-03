import {  Role } from "../../../prisma/generated/prisma";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export  const seedsuPderAdmin = async () =>{
    try{
        const issuPeradminexits = await prisma.user.findFirst({
            where: {
                role:Role.SUPER_ADMIN
            }
        })
        if(issuPeradminexits){
            console.log("Super admin already exists, skipping seeding.");
            return;
        }
        // Create the user through better-auth (sign up) — allowed fields: name, email, password
        const superAdminuser = await auth.api.signUpEmail({
            body: {
                name: "superadmin",
                email: envVars.SUPER_ADMIN,
                password: envVars.SUPER_ADMIN_PASSWORD,
            },
        });

        // Ensure the created user is marked as SUPER_ADMIN and emailVerified in a transaction
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: superAdminuser.user.id },
                data: { emailVerified: true, role: Role.SUPER_ADMIN },
            });
        });

        const suPerAdmin = await prisma.user.findUnique({
            where: { id: superAdminuser.user.id },
        });

        console.log("Super admin seeded successfully:", suPerAdmin);



    }
    catch(error){
        console.error("Error seeding super admin:", error);
        await prisma.user.deleteMany({
            where:{
                email:envVars.SUPER_ADMIN
            }
        })
    }
}