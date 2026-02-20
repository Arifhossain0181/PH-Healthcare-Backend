import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResPonse";
import status from "http-status";
import { adminService } from "./admin.service";
import { updateAdminSchema } from "./admin.validation";

export const adminController = {
  // Get all admins
  getAllAdmins: catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllAdmins();
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Admins retrieved successfully",
      data: result,
    });
  }),

  // Get admin by ID
  getAdminById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.getAdminById(id as string);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  }),

  // Update admin
  updateAdmin: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = updateAdminSchema.parse(req.body);
    const result = await adminService.updateAdmin(id as string, payload);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  }),

  // Soft delete admin
  deleteAdmin: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user; // Assuming you have user information in the request
    const result = await adminService.softDeleteAdmin(id as string , user);
    sendResponse(res, {
      httpStatus: status.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  }),
};
