
export interface SaleAmt {

    SaleAmtId: number;
    CustomerBillId: number;
    ComissionBillId: number;
    HamaliAmt: number;
    TotalAmt: number;
    CompanyId: number;
    CreatedById: number;
    CreatedDate: Date;

}


export interface SaleDetails {

    saleDetailsId: number;
    customerBillId: number;
    customerId: number;
    customerName: string;
    customerBillDate: Date;
    particularName: string;
    farmerId: number;
    qty: number;
    unit: string;
    weight: number;
    rate: number;
    amt: number;
    comissionPercent: number;
    taxRate: number;
    comissionBillId: number;
    createdById: number;
    createdDate: Date;
    companyId: number;
    comissionAmt: number;
    taxAmt: number;
}

