import { Role, UserStatus } from "../../../../prisma/generated/prisma";

export interface ISuperAdmin {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  status: UserStatus;
  isDeleted: boolean;
  needPasswordReset: boolean;
}

export interface ISuperAdminProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}
