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
@Component({
  selector: 'app-trangchu',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './trangchu.component.html',
  styleUrl: './trangchu.component.css'
})
export class TrangchuComponent implements OnInit {
  categories: any[] = [];
  tags: any[] = [];
  articles: any[] = [];
  filterObj = {
    "PageNumber": 1,
    "PageSize": 10
  }
  totalPages = 0;
  articleInPageNumber : any []=[];
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.articles.length / this.filterObj.PageSize);
  }
  setDataPageNumber(page :number){
    let start = (page - 1) * this.filterObj.PageSize;
    let end = page * this.filterObj.PageSize;  
    this.articleInPageNumber = this.articles.slice(start,end);
  }
  onPrevious(){
    if(Number(this.filterObj.PageNumber)===1){
      this.filterObj.PageNumber=1;
    }else{
      this.filterObj.PageNumber-=1;
    }
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  onNext(){
    if(Number(this.filterObj.PageNumber)===this.totalPages){
      this.filterObj.PageNumber=this.totalPages;
    }else{
      this.filterObj.PageNumber+=1;
    }
    this.setDataPageNumber(this.filterObj.PageNumber);
  }
  constructor(private userService: UserService, private router: Router
    , private categoryService: categoryService, private tagService: TagService, private articleService: articleService) {

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
    this.getAllArticles();
  }
  ngOnInit(): void {
    this.setUp();
  }
  searchQuery: string = '';
  search() { }
  getAllArticles() {
    this.articleService.getAllArticlesDaDuyet().subscribe({
      next: (data: any) => {
        this.articles = data.result;

        // Sắp xếp bài viết theo thời gian mới nhất đến cũ nhất
        this.articles.sort((a: any, b: any) => {
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });

        // Định dạng lại thời gian sau khi sắp xếp
        this.articles.forEach((article) => {
          article.published_at = this.formatDateTime(article.published_at);
        });
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
       },
      error: (err) => {
        console.error('Error fetching articles:', err);
      }
    });
   
  }

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

    this.router.navigate([`/articles/${title}`], { queryParams: { id } });
  }
  goToSearchTagCate(type:string,key:string){
    this.router.navigate([`/articles/${type}/${key}`] , {queryParams:{type,key}});
  }
}
