export interface UserMaster {
  userId: number;
  userName: string;
  userFullName: string;
  password: string;
  email: string;
  mobile: string;
  status: number;
  isAdmin: boolean;
  roleId: number;
  designation: string;
  updatedDate: string | Date;
  updatedById: number;
  createdDate: string | Date;
  createdById: number;
  financialYearId: number;
  companyId?: number | null;
  isActive: number;
  companyName: string;
  token: string;
}
