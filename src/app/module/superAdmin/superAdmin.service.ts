import { prisma } from "../../lib/prisma";
import { Role } from "../../../../prisma/generated/prisma";
import APPError from "../../errorhelPers/APPError";
import status from "http-status";
import { UpdateSuperAdminInput } from "./superAdmin.validation";

export const superAdminService = {
  // Get all super admins
  async getAllSuperAdmins() {
    const superAdmins = await prisma.user.findMany({
      where: {
        role: Role.SUPER_ADMIN,
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
    return superAdmins;
  },

  // Get super admin by ID
  async getSuperAdminById(superAdminId: string) {
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId },
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

    if (!superAdmin || superAdmin.role !== Role.SUPER_ADMIN) {
      throw new APPError(
        "Super Admin not found",
        status.NOT_FOUND
      );
    }

    return superAdmin;
  },

  // Update super admin
  async updateSuperAdmin(superAdminId: string, payload: UpdateSuperAdminInput) {
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId },
    });

    if (!superAdmin || superAdmin.role !== Role.SUPER_ADMIN) {
      throw new APPError(
        "Super Admin not found",
        status.NOT_FOUND
      );
    }

    const updatedSuperAdmin = await prisma.user.update({
      where: { id: superAdminId },
      data: {
        name: payload.name || superAdmin.name,
        email: payload.email || superAdmin.email,
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

    return updatedSuperAdmin;
  },

  // Soft delete super admin
  async softDeleteSuperAdmin(superAdminId: string) {
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminId },
    });

    if (!superAdmin || superAdmin.role !== Role.SUPER_ADMIN) {
      throw new APPError(
        "Super Admin not found",
        status.NOT_FOUND
      );
    }

    const deletedSuperAdmin = await prisma.user.update({
      where: { id: superAdminId },
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

    return deletedSuperAdmin;
  },
};
