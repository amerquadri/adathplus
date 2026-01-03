
export interface FarmerBillModel {
    FarmerBillId?: number;
    ComissionBillId?: number;
    VendorId?: number;
    VendorName: string;
    ParticularName: string;
    CompanyId?: number;
    CreatedById?: number;
    CreatedDate?: Date;
    UpdatedById?: number;
    UpdatedDate?: Date;
    BillDate?: Date;
    IsActive?: boolean;
}
export interface FarmerBillExpensesModel {
    CompanyId?: number;
    FarmerBillId?: number;
    ComissionBillId?: number;
    Amt?: number;
    Name: string;
}



export interface VendorInterface {
    vendorId: number;
    vendorName: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    address?: string;
    detail?: string;
    credit: number;
    debit: number;
    openingAmt: number;
    createdById: number;
    createdDate: string;
    updatedById: number;
    updatedDate: string;
    isActive: boolean;
    companyId: number;
}

export interface FarmerBillDetailModel {
    farmerBillDetailId: number;
    ComissionBillId: number;
    particularName: string;
    amt: number;
    qty: number;
    unit: string;
    rate: number;
    weight: number;
    comissionPercent: number;
    comissionAmount?: number;
    companyId?: number;
    
}

export interface farmerBill {

    farmerBillId?: number;
    comissionBillId?: number;
    vendorId?: number;
    vendorName?: string;
    particularName?: string;
    companyId?: number;
    createdById?: number;
    createdDate?: Date;
    updatedById?: number;
    updatedDate?: Date;
    billDate?: Date;
    isActive?: boolean;
}

