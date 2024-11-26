import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { categoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { articleService } from '../../services/article.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent {
  key: any;
  type: string = '';
  categories: any[] = [];
  tags: any[] = [];
  articles: any[] = [];
  filterObj = {
    "PageNumber": 1,
    "PageSize": 10
  }
  totalPages = 0;
  articleInPageNumber: any[] = [];
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
  constructor(private userService: UserService, private router: Router
    , private categoryService: categoryService, private tagService: TagService, private articleService: articleService, private route: ActivatedRoute
  ) {
  }
  getAllCategories() {
    this.categoryService.getAllCategoriesUser(1).subscribe({
      next: (data: any) => {
        this.categories = data;
      }
    })
  }
  getAllTags() {
    this.tagService.getAllTagsUser(1).subscribe({
      next: (data: any) => {
        this.tags = data;

      }
    })
  }
  setUp() {
    this.getAllTags();
    this.getAllCategories();
  }
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      this.type = params['type'];
      this.key = params['key'];

      this.setUp(); 

      // Đợi cho hàm setUpArticle() hoàn thành
      await this.setUpArticle(this.type, this.key);
      this.articles.forEach((article) => {
        article.published_at = this.formatDateTime(article.published_at);
      });
      this.calculateTotalPages();
      this.setDataPageNumber(this.filterObj.PageNumber);
    });
  }
  setUpArticle(type: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (type === 'category') {
        this.articleService.getArticlesByCategory(Number(key)).subscribe({
          next: (data: any) => {
            this.articles = data.result;
            resolve(data); // Đảm bảo resolve sau khi có dữ liệu
          },
          error: (err) => reject(err)
        });
      } else if (type === 'tag') {
        this.articleService.getArticlesByTag(Number(key)).subscribe({
          next: (data: any) => {
            this.articles = data.result;
            resolve(data);
          },
          error: (err) => reject(err)
        });
      } else if (type === 'search') {
        this.articleService.getAllArticles().subscribe({
          next: (data: any) => {
            console.log(key);
            this.articles = data.result;
            if (key !== 'getallarticles') {
              this.articles = this.articles.filter((article: any) =>
                article.title.toLowerCase().includes(key.toLowerCase())
              );
            }
            resolve(data);
          },
          error: (err) => reject(err)
        });
      } else {
        reject('Invalid type'); // Trả về lỗi nếu type không đúng
      }
    });
  }
  searchQuery: string = '';
  search() { }


  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime); // Tạo đối tượng Date từ chuỗi
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  goToChitiet(id: number, title: string) {

    this.router.navigate([`/articlesdetail/${title}`], { queryParams: { id } });
  }
  goToSearchTagCate(type: string, key: string) {
    if (type === 'search' && key.trim() === '') {
      key = 'getallarticles';
    }
    this.router.navigate([`/articles/${type}/${key}`], { queryParams: { type, key } });
  }
}
