import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import các module cần thiết
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, CommonModule]  // Đảm bảo import RouterModule nếu bạn đang sử dụng routing
})
export class AppComponent { }