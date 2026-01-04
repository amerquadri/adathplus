import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface ExpenseItem {
  chargesId?: number;
  name: string;
  companyId?: number;
  details?: string;
  createdDate?: string; // ISO date
}

@Component({
  selector: 'app-farmer-bill-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './farmer-bill-expenses.component.html',
  styleUrl: './farmer-bill-expenses.component.css'
})
export class FarmerBillExpensesComponent {
  @Output() expensesChanged = new EventEmitter<ExpenseItem[]>();
  constructor(private dialogRef: MatDialogRef<FarmerBillExpensesComponent>) {}

  public newExpense: ExpenseItem = { name: '', details: '' };
  public expenses: ExpenseItem[] = [];

  displayedColumns: string[] = ['chargesId', 'name', 'details', 'createdDate', 'actions'];

  addExpense() {
    const item: ExpenseItem = {
      chargesId: (this.expenses.length ? (this.expenses[this.expenses.length - 1].chargesId || 0) + 1 : 1),
      name: (this.newExpense.name || '').trim(),
      details: (this.newExpense.details || '').trim(),
      companyId: this.newExpense.companyId,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    if (!item.name) return;
    this.expenses.push(item);
    this.newExpense = { name: '', details: '' };
    this.expensesChanged.emit(this.expenses);
  }

  removeExpense(index: number) {
    if (index >= 0 && index < this.expenses.length) {
      this.expenses.splice(index, 1);
      this.expensesChanged.emit(this.expenses);
    }
  }

  // remove all expenses (used by header delete action)
  deleteAll() {
    this.expenses = [];
    this.expensesChanged.emit(this.expenses);
  }

  // Close dialog and return current list of expenses
  closeDialog() {
    this.dialogRef.close(this.expenses);
  }

  // Cancel without returning data
  cancel() {
    this.dialogRef.close();
  }
}
