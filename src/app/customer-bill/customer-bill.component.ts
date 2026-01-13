import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MasterPageComponent } from "../master-page.component";
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerbillService } from './customerbill.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListofValuesService } from '../list-of-values/listof-values.service';
import { MatDialog } from '@angular/material/dialog';
import { SaleAmt, SaleDetails } from '../customer-bill/customerbill';
import { Customer } from '../customer-page/customer.service';
import { catchError, map, Observable, of, startWith, timeout  } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@Component({
  selector: 'app-customer-bill',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MasterPageComponent,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
],
  templateUrl: './customer-bill.component.html',
  styleUrls: ['./customer-bill.component.css'],
})
export class CustomerBillComponent {
 // farmerBillControls: FormGroup;
  options: string[] = [];
  myControl = new FormControl('');
  filteredOptions: Observable<string[]> = of([]);

  selectedCustomerId: any = null;
  selectedParticular: string = 'Alu';
  public customerList: Customer[] = [];

 displayedColumns: string[] = ['sr',
     'particularName', 'qty', 'unit', 'rate', 'weight', 'comissionPercent', 'comissionAmount', 'amt', 'view'
  ];

constructor(private dialog: MatDialog, private customerbillService: CustomerbillService, private fb: FormBuilder, private snackBar: MatSnackBar, private lovService: ListofValuesService) {
  
 this. getCustomerNameList();
}


ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
   console.log('Customer Bill Component initialized', this.filteredOptions);  
  }


  

  getCustomerNameList() {
    this.customerbillService.getCustomersNameList()
      .pipe(
        timeout(15000), // 15 seconds timeout
        catchError(err => {
          console.error('Fetch customers failed or timed out:', err);
          // return an empty array so subscriber can treat response uniformly
          return of([]);
        })
      ).subscribe((resp: any) => {
        // Normalize response: many APIs return { data: [...] } or plain array
        const dataList: any[] = Array.isArray(resp) ? resp : (resp && Array.isArray(resp.data) ? resp.data : []);
        this.customerList = dataList;
        this.options = this.customerList.map(v => (v.customerName || '').trim());
        // if valueChanges already set up, update filteredOptions so autocomplete shows suggestions
        this.filteredOptions = of(this.options);
        console.log('Customer list loaded:', this.customerList.length, 'items');
      },
      error => {
        console.error('Error loading customer list:', error);
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onCustomerSelected(selectedName: string) {
    const target = (selectedName || '').trim();
    const found = this.customerList.find(v => (v.customerName || '').trim() === target);
    this.selectedCustomerId = found ? found.customerId : null;
    // you can use selectedCustomerId for form submission or further logic
    // alert(`Selected Customer ID: ${this.selectedCustomerId}`);
  }

}
