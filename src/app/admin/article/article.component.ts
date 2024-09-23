import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { RouterModule,Router } from '@angular/router';
import { category, user } from '../../interface/user.interface';
import { FormsModule } from '@angular/forms';
import { FormUserComponent } from '../form-user/form-user.component';
import { categoryService } from '../../services/category.service';
import { FormCategoryComponent } from '../form-category/form-category.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule,LayoutComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {

}
