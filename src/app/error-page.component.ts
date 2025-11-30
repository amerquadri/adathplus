import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  standalone: true,
  template: `
    <div class="error-container">
      <h2>An error occurred</h2>
      <p>{{ errorMessage }}</p>
    </div>
  `,
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {
  errorMessage: string = 'Something went wrong. Please try again later.';
}
