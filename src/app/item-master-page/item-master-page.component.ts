import { Component } from '@angular/core';
import { MasterPageComponent } from '../master-page.component';

@Component({
  selector: 'app-item-master-page',
  standalone: true,
  imports: [MasterPageComponent],
  templateUrl: './item-master-page.component.html',
  styleUrl: './item-master-page.component.css'
})
export class ItemMasterPageComponent {

}
