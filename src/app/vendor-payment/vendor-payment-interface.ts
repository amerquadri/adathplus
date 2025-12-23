export interface VendorPaymentInterface {
    
  transactionId: number;
  vendorId?: number | 0;
  vendorName?: string;
  customerName?: string;
  transactionDate: Date;
  transactionAmount: number;
  paymentMethod?: string;
  paymentMethodNo?: string;
  paymentMethodBank?: string;
  paymentMethodChequeDate?: Date | 0;
  amountInWords: string;
  discountAmount?: number | 0;
  notes: string;
  createdById?: number | null;
  createdDate?: Date | null;
  companyId: number;

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