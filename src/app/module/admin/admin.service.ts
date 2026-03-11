import { prisma } from "../../lib/prisma";
import { Role, UserStatus } from "../../../../prisma/generated/prisma";
import APPError from "../../errorhelPers/APPError";
import status from "http-status";
import { UpdateAdminInput } from "./admin.validation";
import { IRequest } from "../../interface/request.interface";
import { IChangeUserRole, IChnageuserstatus } from "./admin.interface";


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
      throw new APPError("Admin not found", status.NOT_FOUND);
    }

    return admin;
  },

  // Update admin
  async updateAdmin(adminId: string, payload: UpdateAdminInput) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new APPError("Admin not found", status.NOT_FOUND);
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
  async softDeleteAdmin(adminId: string, user: IRequest) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new APPError("Admin not found", status.NOT_FOUND);
    }
    if (admin.id === user.userId) {
      throw new APPError("You cannot delete yourself", status.FORBIDDEN);
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
  async changeuserstatus(payload: IChnageuserstatus, user: IRequest) {
    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.userId },
    });

    const { userId: targetUserId, userStatus } = payload;

    if (targetUserId === user.userId) {
      throw new APPError("You cannot change your own status", status.FORBIDDEN);
    }

    const userToChange = await prisma.user.findUniqueOrThrow({
      where: { id: targetUserId },
    });

    // Permission checks using currentUser
    if (userToChange.role === Role.SUPER_ADMIN) {
      // No one can change another Super Admin's status
      throw new APPError("You cannot change status of a Super Admin", status.FORBIDDEN);
    }

    if (currentUser.role === Role.ADMIN && userToChange.role === Role.ADMIN) {
      // Admins cannot change status of other admins
      throw new APPError("Admins cannot change status of other admins", status.FORBIDDEN);
    }

    if (userStatus === UserStatus.DELETED) {
      throw new APPError(
        "You cannot set status to DELETED via this endpoint. Use role-specific delete API.",
        status.BAD_REQUEST,
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: userStatus },
    });

    return updatedUser;
  },

  async changeuserRole(payload: IChangeUserRole, user: IRequest) {
    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.userId },
    });

    const { userId: targetUserId, role } = payload;

    const userTochangeRole = await prisma.user.findUniqueOrThrow({
      where: { id: targetUserId },
    });

    if (currentUser.id === targetUserId) {
      throw new APPError("You cannot change your own role", status.FORBIDDEN);
    }

    if (userTochangeRole.role === Role.SUPER_ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
      throw new APPError("You cannot change role of a Super Admin", status.FORBIDDEN);
    }
     const updatedUser = await prisma.user.update({
      where : {
        id: targetUserId
      },
      data : {
        role      }
     })
     return updatedUser;

  },
};
