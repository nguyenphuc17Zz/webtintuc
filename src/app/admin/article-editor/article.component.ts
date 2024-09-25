import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { RouterModule, Router } from '@angular/router';
import { category, user } from '../../interface/user.interface';
import { FormsModule } from '@angular/forms';
import { FormUserComponent } from '../form-user/form-user.component';
import { categoryService } from '../../services/category.service';
import { FormCategoryComponent } from '../form-category/form-category.component';
import { CommonModule } from '@angular/common';
import { articleService } from '../../services/article.service';
import { FormUpdateArticleComponent } from '../form-update-article/form-update-article.component';
@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, LayoutComponent, FormsModule, FormUpdateArticleComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  isVisible: boolean = false;
  filterObj = {
    "Name": "",
    "CategoryName": "",
    "Status": "all",
    "PageNumber": 1,
    "PageSize": 5
  }
  articleInPageNumber: any[] = [];
  totalPages = 0;
  id: number = Number(localStorage.getItem('id'));
  articles: any[] = [];
  constructor(private router: Router, private articleService: articleService) { }
  ngOnInit(): void {
    this.getArticleById();
  }
  getArticleById() {
    this.articleService.getArticleById(this.id).subscribe({
      next: (data: any) => {
        this.articles = data;
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
        console.log(data);
      }
    })
  }
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.articles.length / this.filterObj.PageSize);
  }
  setDataPageNumber(page: number) {
    let start = (page - 1) * this.filterObj.PageSize;
    let end = page * this.filterObj.PageSize;
    this.articleInPageNumber = this.articles.slice(start, end);
  }
  onPrevious() {
    if (Number(this.filterObj.PageNumber) === 1) {
      this.filterObj.PageNumber = 1;
    } else {
      this.filterObj.PageNumber -= 1;
    }
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  onNext() {
    if (Number(this.filterObj.PageNumber) === this.totalPages) {
      this.filterObj.PageNumber = this.totalPages;
    } else {
      this.filterObj.PageNumber += 1;
    }
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  onChange1(event: any) {
    this.filterObj.PageNumber = 1;
    this.calculateTotalPages();
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  idz = -1;
  openForm(event: Event) {
    this.isVisible = true;
    const target = event.currentTarget as HTMLElement; // Lấy element chính là <tr>
    let articleId = Number(target.getAttribute('data-id')); // Lấy giá trị từ data-id của <tr>
    this.idz = articleId;
  }

  refresh() {
    this.filterObj.Name = '';
    this.filterObj.PageNumber = 1;
    this.filterObj.PageSize = 5;
    this.filterObj.Status = 'all';
    this.getArticleById();
  }
  toggleStatus(event: Event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài hàng <tr>
    const target = event.target as HTMLElement;
    let articleId = Number(target.getAttribute('data-id'));
    let articleStatus = target.getAttribute('data-status');
    articleStatus = articleStatus === 'choduyet' ? 'nhap' : 'choduyet';
    this.articleService.updateArticleStatus(articleId, articleStatus).subscribe({
      next: (data: any) => {
        if (data.status === 1) {
          this.refresh();
        } else {
          alert('Cập nhật thất bại');
        }
      }
    })
  }
  onSearch() {

    this.filterObj.PageNumber = 1;
    let name = this.filterObj.Name;
    let category = this.filterObj.CategoryName;
    if (name === '') {
      name = 'all';
    }
    if (category === '') {
      category = 'all';
    }
    name = name.toLowerCase();
    category = category.toLowerCase();
    let status = this.filterObj.Status;
    this.articleService.filterMyArticle(name, category, status, this.id).subscribe({
      next: (data: any) => {
        this.articles = data;
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
      }
    })
  }
  handleClose(): void {
    this.isVisible = false;
    this.refresh();
  }
}
