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
  selector: 'app-chitietbaiviet',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule,FormsModule],
  templateUrl: './chitietbaiviet.component.html',
  styleUrl: './chitietbaiviet.component.css'
})
export class ChitietbaivietComponent implements OnInit {
  id !: number;
  article!:any;
  tagsNow: {article_id:-1,status:-1,tag_id:any,tag_name:''}[] = [];

  constructor(private route: ActivatedRoute,private articleService:articleService,private router: Router) { }

  ngOnInit(): void {
      this.route.queryParams.subscribe(params=>{
        this.id=Number(params['id']);
      })
      console.log(this.id);
      this.getArticleById(this.id);
      this.getAllTagById(this.id);
  }
  getArticleById(id:number){
    this.articleService.getArticleAllById(id).subscribe({next:(data:any)=>{
      this.article=data[0];
      console.log(this.article);
      this.article.published_at=this.formatDateTime(this.article.published_at);
    }})
  }
  getAllTagById(id:number){
    this.articleService.getArticleTagById(id).subscribe({next:(data:any)=>{
      this.tagsNow=data;
      console.log(this.tagsNow);
    }})
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
goToSearchTagCate(type:string,key:string){
  this.router.navigate([`/articles/${type}/${key}`] , {queryParams:{type,key}});
}
}
