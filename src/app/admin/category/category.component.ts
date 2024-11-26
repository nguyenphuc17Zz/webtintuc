import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { RouterModule,Router } from '@angular/router';
import { category, user } from '../../interface/user.interface';
import { FormsModule } from '@angular/forms';
import { FormUserComponent } from '../form-user/form-user.component';
import { categoryService } from '../../services/category.service';
import { FormCategoryComponent } from '../form-category/form-category.component';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [LayoutComponent, FormsModule,  FormCategoryComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  filterObj={
    "Name":"",
    "Status":"all",
    "PageNumber":1,
    "PageSize":5
  }
  categories :category[]=[];
  cateInPageNumber : category[]=[];
  totalPages = 0;

  constructor(private categoryService : categoryService){}
  ngOnInit(): void {
      this.getAllCategories();
  }

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe({
      next:(data:any)=>{
        this.categories=data;
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
      }
    })
  }
  calculateTotalPages(){
    this.totalPages=Math.ceil(this.categories.length/this.filterObj.PageSize);
  }
  setDataPageNumber(page :number){
    let start = (page - 1) * this.filterObj.PageSize;
    let end = page * this.filterObj.PageSize;  
    this.cateInPageNumber = this.categories.slice(start,end);
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
  onChange1(event:any){
    this.filterObj.PageNumber=1;
    this.calculateTotalPages();
    this.setDataPageNumber(this.filterObj.PageNumber);
  }


  onSearch(){
    this.filterObj.PageNumber=1;
    let name = this.filterObj.Name;
    if(name===''){
      name='all';
    }
    name=name.toLowerCase();

    let status = this.filterObj.Status;
    this.categoryService.filterCategory(name,status).subscribe({
      next:(data:any)=>{
        this.categories=data;
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
      }
    })
  }

  refresh(){
    this.filterObj.Name='';
    this.filterObj.PageNumber=1;
    this.filterObj.PageSize=5;
    this.filterObj.Status='all';
    this.getAllCategories();
  }
  isEditing:boolean=false;
  isVisible:boolean=false;
  categoryTemp:category ={
    category_id:-1,
    category_name:'',
    description:'',
    image_cate:'',
    status:true
  }

  openForm(edit:boolean,categoryZ : category)
  {
    if(edit){
      this.categoryTemp=categoryZ;
    }else{
      this.categoryTemp ={
        category_id:-1,
        category_name:'',
        description:'',
        image_cate:'',
        status:true
      }
    }
    this.isEditing=edit;
    this.isVisible=true;
  }

  handleClose(): void {
    this.isVisible = false;
    this.refresh();
  }
  // SORT
  idSort:boolean=false;
  tenSort:boolean= false;
  statusSort:boolean=false;


  onIdSort(){
    this.idSort=!this.idSort;
    if(this.idSort){
      this.cateInPageNumber.sort((a,b)=>b.category_id -a.category_id);
    }else{
      this.cateInPageNumber.sort((a,b)=>a.category_id -b.category_id);
    }
  }
  onTenSort(){
    this.tenSort=!this.tenSort;
    if(this.tenSort){
      this.cateInPageNumber.sort((a,b)=>{
        if(a.category_name<b.category_name) return -1;
        if(a.category_name>b.category_name) return -1;
        return 0;
      })
    }else{
      this.cateInPageNumber.sort((a,b)=>{
        if(a.category_name>b.category_name) return -1;
        if(a.category_name<b.category_name) return -1;
        return 0;
      })
    }
  }
  onStatusSort(){
    this.statusSort=!this.statusSort;
    if(this.statusSort){
       // Sắp xếp true (1) trước false (0)
       this.cateInPageNumber.sort((a, b) => {
        return +b.status - +a.status; // Chuyển đổi boolean thành số 1 và 0
      });
    }else{
       // Sắp xếp false (0) trước true (1)
       this.cateInPageNumber.sort((a, b) => {
        return +a.status - +b.status; // Chuyển đổi boolean thành số 1 và 0
      });
    }
  }
  

  
}
