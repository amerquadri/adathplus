import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginPageTestComponent } from './login-page-test/login-page-test.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

import { CustomerPageComponent } from './customer-page/customer-page.component';
import { VendorPageComponent } from './vendor-page/vendor-page.component';
import { ItemMasterPageComponent } from './item-master-page/item-master-page.component';
import { ErrorPageComponent } from './error-page.component';
import { DashboardPageTestComponent } from './dashboard-page-test/dashboard-page-test.component';
import { CustomerPageTestComponent } from './customer-page-test/customer-page-test.component';
import { VendorPaymentComponent } from './vendor-payment/vendor-payment.component';
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';
import { FarmerBillComponent } from './farmer-bill/farmer-bill.component';
import { ListOfValuesComponent } from './list-of-values/list-of-values.component';
import { CustomerBillComponent } from './customer-bill/customer-bill.component';
import { CompanySelectionComponent } from './company-selection/company-selection.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { CompanyMasterComponent } from './company-master/company-master.component';


export const routes: Routes = [
	{
		path: '',
		component: LoginPageComponent,
		data: { breadcrumb: 'Login' }
	},
	{
		path: 'login-page',
		component: LoginPageComponent,
		data: { breadcrumb: 'Login' }
	},
	{
		path: 'dashboard-page',
		component: DashboardPageComponent,
		data: { breadcrumb: 'Dashboard' }
	},
	{
		path: 'customer-page-test',
		component: CustomerPageTestComponent,
		data: { breadcrumb: 'Master / Customer Master' }
	},
		{
		path: 'customer-page',
		component: CustomerPageComponent,
		data: { breadcrumb: 'Master / Customer Detail Master' }
	},
	{
		path: 'vendor-page',
		component: VendorPageComponent,
		data: { breadcrumb: 'Master / Farmer Master' }
	},
	{
		path: 'item-master-page',
		component: ItemMasterPageComponent,
		data: { breadcrumb: 'Master / Item Master' }
	},
	{
		path: 'error-page',
		component: ErrorPageComponent,
		data: { breadcrumb: 'Error' }
	},
	{
		path:'vendor-payment',
		component: VendorPaymentComponent,
		data: { breadcrumb:'Master / Vendor Payment'}
	},
	{
		path:'customer-payment',
		component: CustomerPaymentComponent,
		data: { breadcrumb:'Master / Customer Payment'}
	},
	{
		path:'farmer-bill',
		component: FarmerBillComponent,
		data: { breadcrumb:'Master / Farmer Bill'}
	},
	{
		path:'list-of-values',
		component: ListOfValuesComponent,
		data: { breadcrumb:'Master / List of Values'}
	},
	{
		path:'customer-bill',
		component: CustomerBillComponent,
		data: { breadcrumb:'Master / Customer Bill'}
	},
	{
		path:'company-selection',
		component: CompanySelectionComponent,
		data: { breadcrumb:'Company Selection'}
	},
	{
		path:'user-master',
		component: UserMasterComponent,
		data: { breadcrumb:'Master / User Master'}
	},
	// {
	// 	path: '**',
	// 	component: ErrorPageComponent,
	// 	data: { breadcrumb: 'Error' }	
	// },
	{
		path: "company-master",
		component: CompanyMasterComponent,
		data: { breadcrumb: "Master / Company Master" }
	}

];
