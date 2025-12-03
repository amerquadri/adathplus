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
import { VendorPageTestComponent } from './vendor-page-test/vendor-page-test.component';
import { VendorPaymentComponent } from './vendor-payment/vendor-payment.component';


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
		data: { breadcrumb: 'Customer Test' }
	},
	{
		path: 'vendor-page-test',
		component: VendorPageTestComponent,
		data: { breadcrumb: 'Vendor Test' }
	},
	{
		path: 'customer-page',
		component: CustomerPageComponent,
		data: { breadcrumb: 'Master / Customer' }
	},
	{
		path: 'vendor-page',
		component: VendorPageComponent,
		data: { breadcrumb: 'Master / Vendor' }
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
];
