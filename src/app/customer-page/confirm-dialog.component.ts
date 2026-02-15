import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header">
        <div class="icon-wrapper warning">
          <mat-icon>warning</mat-icon>
        </div>
        <h2>{{data.title || 'Confirm Action'}}</h2>
      </div>
      <mat-dialog-content>
        <p class="message">{{data.message}}</p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-stroked-button class="cancel-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button mat-raised-button class="confirm-btn" (click)="onConfirm()">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 0;
    }
    
    .dialog-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 24px 16px;
      text-align: center;
    }
    
    .icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    
    .icon-wrapper.warning {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
      box-shadow: 0 8px 25px rgba(238, 90, 90, 0.3);
    }
    
    .icon-wrapper mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    
    .dialog-header h2 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
      color: #2d3748;
    }
    
    mat-dialog-content {
      padding: 0 24px 16px !important;
      text-align: center;
    }
    
    .message {
      color: #718096;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }
    
    mat-dialog-actions {
      padding: 16px 24px 24px !important;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    
    .cancel-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 20px;
      height: 42px;
      border-radius: 10px !important;
      font-weight: 500;
      color: #718096 !important;
      border-color: #e2e8f0 !important;
      transition: all 0.2s ease;
    }
    
    .cancel-btn:hover {
      background: #f7fafc !important;
      border-color: #cbd5e0 !important;
    }
    
    .cancel-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .confirm-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 24px;
      height: 42px;
      border-radius: 10px !important;
      font-weight: 500;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3) !important;
      transition: all 0.3s ease;
    }
    
    .confirm-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(238, 90, 90, 0.4) !important;
    }
    
    .confirm-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    @media (max-width: 400px) {
      mat-dialog-actions {
        flex-direction: column-reverse;
      }
      
      .cancel-btn, .confirm-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() {
    this.dialogRef.close('confirm');
  }

  onCancel() {
    this.dialogRef.close('cancel');
  } 
}
