import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MasterPageComponent } from "../master-page.component";
import { ListofValuesService } from './listof-values.service';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, timeout } from 'rxjs';
 
interface ListValue {
  ValuesId: number;
  Form: string;
  Name: string;
  Values?: string | null;
  Details?: string | null;
}

@Component({
  selector: 'app-list-of-values',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MasterPageComponent,
    MatPaginator
],
  templateUrl: './list-of-values.component.html',
  styleUrls: ['./list-of-values.component.css']
})
export class ListOfValuesComponent {
  form: FormGroup;
  items: ListValue[] = [];
  private nextId = 1;
  editingId: number | null = null;
  displayedColumns: string[] = ['ValuesId', 'Form', 'Name', 'Values', 'Details', 'Actions'];
  dataSource: MatTableDataSource<ListValue>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private lovService: ListofValuesService) {
    this.form = this.fb.group({
      Form: ['', [Validators.required, Validators.maxLength(100)]],
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      Values: ['', [Validators.maxLength(200)]],
      Details: ['', [Validators.maxLength(200)]]
    });
    this.dataSource = new MatTableDataSource<ListValue>(this.items);
    this.loadListOfValues();
    this.fetchVendors();
  }


loadListOfValues() { 
  this.lovService.getListOfValues().subscribe((data: any[]) => {
    this.items = (data || []).map(d => {
      const src = d || {};
      return {
        ValuesId: src.ValuesId ?? src.valuesId ?? src.valuesID ?? 0,
        Form: src.Form ?? src.form ?? '',
        Name: src.Name ?? src.name ?? '',
        Values: src.Values ?? src.values ?? null,
        Details: src.Details ?? src.details ?? null
      } as ListValue;
    });
    this.dataSource.data = this.items;
  });

}

  fetchVendors() {
    this.lovService.getListOfValues()
      .subscribe((data: any[]) => {
       // this.dataSource.data = data.data || data || [];
        this.items = (data || []).map(d => {
              const src = d || {};
              return {
                ValuesId: src.ValuesId ?? src.valuesId ?? src.valuesID ?? 0,
                Form: src.Form ?? src.form ?? '',
                Name: src.Name ?? src.name ?? '',
                Values: src.Values ?? src.values ?? null,
                Details: src.Details ?? src.details ?? null
              } as ListValue;
            });
        this.dataSource.data = this.items;
        if (this.paginator) this.dataSource.paginator = this.paginator;
      });
  }

  addOrUpdate() {
    if (this.form.invalid) return;
    const val = this.form.value;
    const payload: any = {
      ValuesId: this.editingId ?? 0,
      Form: val.Form,
      Name: val.Name,
      Values: val.Values || null,
      Details: val.Details || null
    };

    if (this.editingId == null) {
      this.lovService.insertListOfValue(payload).subscribe(res => {
        const item: ListValue = {
          ValuesId: res?.ValuesId ?? this.nextId++,
          Form: res?.Form ?? payload.Form,
          Name: res?.Name ?? payload.Name,
          Values: res?.Values ?? payload.Values,
          Details: res?.Details ?? payload.Details
        };
        this.items.push(item);
        this.dataSource.data = this.items;
        this.form.reset();
      }, err => console.error('Insert failed', err));
    } else {
      this.lovService.updateListOfValue(payload).subscribe(res => {
        const idx = this.items.findIndex(i => i.ValuesId === this.editingId);
        if (idx !== -1) {
          this.items[idx] = {
            ValuesId: res?.ValuesId ?? this.editingId!,
            Form: res?.Form ?? payload.Form,
            Name: res?.Name ?? payload.Name,
            Values: res?.Values ?? payload.Values,
            Details: res?.Details ?? payload.Details
          };
          this.dataSource.data = this.items;
        }
        this.editingId = null;
        this.form.reset();
      }, err => console.error('Update failed', err));
    }
  }

  edit(item: ListValue) {
    this.editingId = item.ValuesId;
    this.form.setValue({
      Form: item.Form,
      Name: item.Name,
      Values: item.Values ?? '',
      Details: item.Details ?? ''
    });
  }

  delete(id: number) {
    this.lovService.deleteListOfValue(id).subscribe(() => {
      this.items = this.items.filter(i => i.ValuesId !== id);
      this.dataSource.data = this.items;
      if (this.editingId === id) {
        this.editingId = null;
        this.form.reset();
      }
    }, err => console.error('Delete failed', err));
  }

  reset() {
    this.editingId = null;
    this.form.reset();
  }
}
