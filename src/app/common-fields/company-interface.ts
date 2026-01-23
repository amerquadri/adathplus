export interface CompanyInterface {
    companyID: number;
    companyName: string;
    detail: string;
    address1: string;
    address2: string;
    address3: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone1: string;
    phone2: string;
    phone3: string;
    phone4: string;
    email1: string;
    email2: string;
    website: string;
    isActive?: boolean;
    financialYear: string;
    createdDate: Date;
    createdBy: number;
    modifiedDate: Date;
    modifiedDateBy: number;
}
