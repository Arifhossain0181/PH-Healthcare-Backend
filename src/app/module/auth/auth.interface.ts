
export  interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface IchangePassword {

  currentPassword: string;
  newPassword: string;
}