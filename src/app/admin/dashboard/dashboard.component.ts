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
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  filterObj = {
    "Name": "",
    "CategoryName": "",
    "Status": "all",
    "PageNumber": 1,
    "PageSize": 5
  }
  articleInPageNumber: any[] = [];
  totalPages = 0;
  articles: any[] = [];
  constructor(private router: Router, private articleService: articleService) { }
  ngOnInit(): void {
    this.getAllArticle();
  }
  getAllArticle() {
    this.articleService.getAllArticles2().subscribe({
      next: (data: any) => {
        this.articles = data;
        this.articles.reverse();
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
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
  refresh() {
    this.filterObj.Name = '';
    this.filterObj.CategoryName = '';
    this.filterObj.PageNumber = 1;
    this.filterObj.PageSize = 5;
    this.filterObj.Status = 'all';
    this.getAllArticle();
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
    this.articleService.filterMyArticle2(name, category, status).subscribe({
      next: (data: any) => {
        this.articles = data;
        this.articles.reverse();
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
      }
    })
  }
  cateSort: boolean = false;
  tenSort: boolean = false;
  statusSort: boolean = false;
  sortTitle() {
    this.tenSort = !this.tenSort;
    if (this.tenSort) {
      this.articles.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return -1;
        return 0;
      })
    } else {
      this.articles.sort((a, b) => {
        if (a.title > b.title) return -1;
        if (a.title < b.title) return -1;
        return 0;
      })
    }
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  sortCate() {
    this.cateSort = !this.cateSort;
    if (this.cateSort) {
      this.articles.sort((a, b) => {
        if (a.category_name < b.category_name) return -1;
        if (a.category_name > b.category_name) return -1;
        return 0;
      })
    } else {
      this.articles.sort((a, b) => {
        if (a.category_name > b.category_name) return -1;
        if (a.category_name < b.category_name) return -1;
        return 0;
      })
    }
    this.setDataPageNumber(this.filterObj.PageNumber);

  }
  sortStatus() {
    this.statusSort = !this.statusSort; // đảo ngược thứ tự sắp xếp
    let statusPriority: { [key: string]: number } = { 'choduyet': 1, 'nhap': 2, 'daduyet': 3, 'bigo': 4 };

    if (this.statusSort) {
      this.articles.sort((a, b) => {
        return statusPriority[a.article_status as keyof typeof statusPriority] -
          statusPriority[b.article_status as keyof typeof statusPriority];
      });
    } else {
      this.articles.sort((a, b) => {
        return statusPriority[b.article_status as keyof typeof statusPriority] -
          statusPriority[a.article_status as keyof typeof statusPriority];
      });
    }
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  approveArticle(event: Event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài hàng <tr>
    const target = event.target as HTMLElement;
    let articleId = Number(target.getAttribute('data-id'));

    // Đặt trạng thái là 'daduyet' (đã duyệt)
    let articleStatus = 'daduyet';

    this.articleService.updateArticleStatus(articleId, articleStatus).subscribe({
      next: (data: any) => {
        if (data.status === 1) {
          this.refresh(); // Refresh lại danh sách sau khi duyệt thành công
        } else {
          alert('Duyệt bài viết thất bại');
        }
      }
    });
  }

  removeArticle(event: Event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài hàng <tr>
    const target = event.target as HTMLElement;
    let articleId = Number(target.getAttribute('data-id'));

    // Đặt trạng thái là 'bigo' (bị gỡ)
    let articleStatus = 'bigo'; 

    this.articleService.updateArticleStatus(articleId, articleStatus).subscribe({
      next: (data: any) => {
        if (data.status === 1) {
          this.refresh(); // Refresh lại danh sách sau khi gỡ thành công
        } else {
          alert('Gỡ bài viết thất bại');
        }
      }
    });
}


}
