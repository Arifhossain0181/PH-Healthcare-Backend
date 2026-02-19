import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";
import status from "http-status";
import { superAdminService } from "./superAdmin.service";
import { updateSuperAdminSchema } from "./superAdmin.validation";

export const superAdminController = {
  // Get all super admins
  getAllSuperAdmins: catchAsync(async (req: Request, res: Response) => {
    const result = await superAdminService.getAllSuperAdmins();
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Super Admins retrieved successfully",
      data: result,
    });
  }),

  // Get super admin by ID
  getSuperAdminById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await superAdminService.getSuperAdminById(id as string);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Super Admin retrieved successfully",
      data: result,
    });
  }),

  // Update super admin
  updateSuperAdmin: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = updateSuperAdminSchema.parse(req.body);
    const result = await superAdminService.updateSuperAdmin(id as string, payload);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Super Admin updated successfully",
      data: result,
    });
  }),

  // Soft delete super admin
  deleteSuperAdmin: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await superAdminService.softDeleteSuperAdmin(id as string);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Super Admin deleted successfully",
      data: result,
    });
  }),
};
