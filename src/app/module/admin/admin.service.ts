import { prisma } from "../../lib/prisma";
import { Role,  } from "../../../../prisma/generated/prisma";
import APPError from "../../errorhelPers/APPError";
import status from "http-status";
import {  UpdateAdminInput } from "./admin.validation";
import { IRequest } from "../../interface/request.interface";

export const adminService = {
  // Get all admins
  async getAllAdmins() {
    const admins = await prisma.user.findMany({
      where: {
        role: Role.ADMIN,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        status: true,
      },
    });
    return admins;
  },

  // Get admin by ID
  async getAdminById(adminId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        status: true,
      },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new APPError(
        "Admin not found",
        status.NOT_FOUND
      );
    }

    return admin;
  },

  // Update admin
  async updateAdmin(adminId: string, payload: UpdateAdminInput) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new APPError(
        "Admin not found",
        status.NOT_FOUND
      );
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: {
        name: payload.name || admin.name,
        email: payload.email || admin.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        status: true,
      },
    });

    return updatedAdmin;
  },

  // Soft delete admin
  async softDeleteAdmin(adminId: string , user: IRequest) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new APPError(
        "Admin not found",
        status.NOT_FOUND
      );
    }
    if(admin.id === user.userId){
      throw new APPError(
        "You cannot delete yourself",
        status.FORBIDDEN
      );
    }
    const deletedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: {
        isDeleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isDeleted: true,
      },
    });

    return deletedAdmin;
  },
};
