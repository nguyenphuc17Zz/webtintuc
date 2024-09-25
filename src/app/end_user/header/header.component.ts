import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { categoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  id: any = localStorage.getItem('id');
  user: any = {};
  categories :any[]=[];
  tags :any[]=[];
  constructor(private userService: UserService,private router: Router
    ,private categoryService: categoryService,private tagService: TagService) 
  {

  }
  ngOnInit(): void {
    this.getUserById();
    this.setUpCateAndTag();
  }
  getUserById() {
    let id = localStorage.getItem('id');
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (data: any) => {
          this.user = data.user;
          console.log(this.user);
        }
      })
    }

  }

  deleteLs() {
    localStorage.clear();
  }
  goTrangchu(){
    this.router.navigate(['/trangchu']);
  }
  getAllCategories(){
    this.categoryService.getAllCategoriesUser(1).subscribe({next:(data:any)=>{
      this.categories=data;
    }})
  }
  getAllTags(){
    this.tagService.getAllTagsUser(1).subscribe({next:(data:any)=>{
      this.tags=data;
    }})
  }
  setUpCateAndTag(){
    this.getAllTags();
    this.getAllCategories();
  }
}
