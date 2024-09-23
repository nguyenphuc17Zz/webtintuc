import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { FormTagComponent } from '../form-tag/form-tag.component';
import { tag } from '../../interface/user.interface';
import { TagService } from '../../services/tag.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [LayoutComponent,FormTagComponent,FormsModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent implements OnInit {
  filterObj={
    "Name":"",
    "Status":"all",
    "PageNumber":1,
    "PageSize":5
  }
  tags:tag[]=[];
  tagInPageNumber:tag[]=[];
  totalPages=0;
  constructor(private tagService : TagService){}
  ngOnInit(): void {
    this.getAllTags();
  }
  getAllTags(){
    this.tagService.getAllTags().subscribe({
      next:(data:any)=>{
        this.tags=data;
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
      }
    })
  }
  setDataPageNumber(page :number){
    let start = (page - 1) * this.filterObj.PageSize;
    let end = page * this.filterObj.PageSize;  
    this.tagInPageNumber = this.tags.slice(start,end);
  }
  calculateTotalPages(){
    this.totalPages=Math.ceil(this.tags.length/this.filterObj.PageSize);
  }
  onSearch(){
    this.filterObj.PageNumber=1;
    let name = this.filterObj.Name;
    if(name===''){
      name='all';
    }
    name=name.toLowerCase();

    let status = this.filterObj.Status;
    this.tagService.filterTag(name,status).subscribe({
      next:(data:any)=>{
        this.tags=data;
        this.calculateTotalPages();
        this.setDataPageNumber(this.filterObj.PageNumber);
      }
    })
    
  }
  tagTemp!:tag;
  openForm(edit:boolean, tagZ:tag){
    if(edit){
      this.tagTemp=tagZ;
    }else{
      this.tagTemp ={
       tag_id:-1,
       tag_name:'',
       status:true
      }
    }
    this.isEditing=edit;
    this.isVisible=true;
  }
  refresh(){
    this.filterObj.Name='';
    this.filterObj.PageNumber=1;
    this.filterObj.PageSize=5;
    this.filterObj.Status='all';
    this.getAllTags();
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

  idSort:boolean=false;
  tenSort:boolean= false;
  statusSort:boolean=false;
  onIdSort(){
    this.idSort=!this.idSort;
    if(this.idSort){
      this.tagInPageNumber.sort((a,b)=>b.tag_id -a.tag_id);
    }else{
      this.tagInPageNumber.sort((a,b)=>a.tag_id -b.tag_id);
    }
  }
  onNameSort(){
    this.tenSort=!this.tenSort;
    if(this.tenSort){
      this.tagInPageNumber.sort((a,b)=>{
        if(a.tag_name<b.tag_name) return -1;
        if(a.tag_name>b.tag_name) return -1;
        return 0;
      })
    }else{
      this.tagInPageNumber.sort((a,b)=>{
        if(a.tag_name>b.tag_name) return -1;
        if(a.tag_name<b.tag_name) return -1;
        return 0;
      })
    }
  }
  onStatusSort(){
    this.statusSort=!this.statusSort;
    if(this.statusSort){
       // Sắp xếp true (1) trước false (0)
       this.tagInPageNumber.sort((a, b) => {
        return +b.status - +a.status; // Chuyển đổi boolean thành số 1 và 0
      });
    }else{
       // Sắp xếp false (0) trước true (1)
       this.tagInPageNumber.sort((a, b) => {
        return +a.status - +b.status; // Chuyển đổi boolean thành số 1 và 0
      });
    }
  }
  isVisible:boolean=false;
  isEditing:boolean=false;
  handleClose(): void {
    this.isVisible = false;
    this.refresh();
  }

  onChange1(event:any){
    this.filterObj.PageNumber=1;
    this.calculateTotalPages();
    this.setDataPageNumber(this.filterObj.PageNumber);
  }

}
