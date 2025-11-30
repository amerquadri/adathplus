import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-page-test',
  standalone: true,
  imports: [MatCard, ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, CommonModule],
  templateUrl: './login-page-test.component.html',
  styleUrl: './login-page-test.component.css'
})
export class LoginPageTestComponent {
  loginForm: FormGroup;

 constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log(this.loginForm.value);
      window.location.href = '/dashboard-page'; // Redirect to dashboard after login
    }
  }

}
