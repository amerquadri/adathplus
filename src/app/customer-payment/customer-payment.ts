export interface CustomerPaymentInterface {
  transactionId: number;
  customerId?: number | 0;
  customerName: [''];
  transactionDate: Date;
  transactionAmount: number;
  paymentMethod: [''];
  paymentMethodNo: [''];
  paymentMethodBank: [''];
  paymentMethodChequeDate?: Date | 0;
  amountInWords: string;
  discountAmount?: number | 0;
  notes: string;
  createdById?: number | null;
  createdDate?: Date | null;
  companyId: number;

}
 
export interface CustomerInterface {
    customerId: number;
    customerName: [''];
    phone1: [''];
    phone2: [''];
    email: [''];
    address: [''];
    detail: [''];
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