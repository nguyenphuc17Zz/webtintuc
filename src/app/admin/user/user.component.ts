import { Component } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { RouterModule,Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { user } from '../../interface/user.interface';
import { FormsModule } from '@angular/forms';
import { FormUserComponent } from '../form-user/form-user.component';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LayoutComponent,FormsModule,FormUserComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  users : user[]=[];
  userInPageNumber : user[]=[];
  filterObj={
    "Name":"",
    "Email":"",
    "Role":"",
    "PageNumber":1,
    "PageSize":5
  }
  totalPages=0;
  constructor(private userService: UserService,private router: Router){
    
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  // GET ALL USERS
  getAllUsers(){
    this.userService.getAllUsers().subscribe({
      next: (data:any) => {
        this.users = data.user;
        this.totalPages=Math.ceil(this.users.length / this.filterObj.PageSize);
        this.setDataPhanTrang(this.filterObj.PageNumber);
      }
    })
  }

  onPrevious(){
    if(Number(this.filterObj.PageNumber)===1){
      this.filterObj.PageNumber=1;
    }else{
      this.filterObj.PageNumber-=1;
    }
    this.setDataPhanTrang(this.filterObj.PageNumber);
  }
  onNext(){
    if(Number(this.filterObj.PageNumber)===this.totalPages){
      this.filterObj.PageNumber=this.totalPages;
    }else{
      this.filterObj.PageNumber+=1;
    }
    this.setDataPhanTrang(this.filterObj.PageNumber);

  }
  
  // GỞI DATA FILTER
  onFilter(){
    let aName:string='';
    let bEmail:string='' 
    let cRole: string='';
    if(this.filterObj.Name===''){
      aName='all';
    }else{
      aName=this.filterObj.Name;  
    }
    if(this.filterObj.Email===''){
      bEmail='all';
    }else{
      bEmail=this.filterObj.Email;
    }
    if(this.filterObj.Role===''){
      cRole='all';
    }else{
      cRole=this.filterObj.Role;
    }
    this.userService.filterUser(aName,bEmail,cRole).subscribe({
      next:(data:any)=>{
        this.users=data;
        this.totalPages=Math.ceil(this.users.length / this.filterObj.PageSize);
        this.setDataPhanTrang(this.filterObj.PageNumber);
      }
    })
  }
  clickBtn(){
    this.filterObj.PageNumber=1;
    this.onFilter();
  }  
  // PHÂN TRANG
  
  setDataPhanTrang(trang : number){
    let start = (trang - 1) * this.filterObj.PageSize;
    let end = trang * this.filterObj.PageSize;  
    this.userInPageNumber = this.users.slice(start,end);
  }

  // CÁC BIẾN XÀI ĐỂ SẮP XẾP
  sortId: boolean=false;
  sortTen: boolean=false;
  sortEmail: boolean=false;
  sortTrangThai: boolean=false;
  // HÀM SORT THEO ID
  onSortId(){
    this.sortId =!this.sortId;
    // TRUE THÌ TỪ LỚN VỀ NHỎ , FALSE THÌ NHỎ TỚI LỚN 
    if(this.sortId===true){
      this.userInPageNumber.sort((a,b)=> b.user_id - a.user_id);
    }else{
      this.userInPageNumber.sort((a,b)=> a.user_id - b.user_id);

    }
  }
  // HÀM SORT THEO NAME
  onSortName(){
    this.sortEmail =!this.sortEmail;
    // TRUE THÌ TỪ LỚN VỀ NHỎ , FALSE THÌ NHỎ TỚI LỚN 
    if(this.sortEmail===true){
      this.userInPageNumber.sort((a,b)=>{
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
        return 0;
      })
    }else{
      this.userInPageNumber.sort((a,b)=>{
        if (a.email > b.email) return -1;
        if (a.email < b.email) return 1;
        return 0;
      })
    }
  }


// HÀM SORT THEO EMAIL
  onSortEmail(){
    this.sortTen =!this.sortTen;
    // TRUE THÌ TỪ LỚN VỀ NHỎ , FALSE THÌ NHỎ TỚI LỚN 
    if(this.sortTen===true){
      this.userInPageNumber.sort((a,b)=>{
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
        return 0;
      })
    }else{
      this.userInPageNumber.sort((a,b)=>{
        if (a.username > b.username) return -1;
        if (a.username < b.username) return 1;
        return 0;
      })
    }
  }
  // HÀM SORT TRẠNG THÁI
  onSortTrangThai() {
    this.sortTrangThai = !this.sortTrangThai;
  
    if (this.sortTrangThai === true) {
      // Sắp xếp true (1) trước false (0)
      this.userInPageNumber.sort((a, b) => {
        return +b.status - +a.status; // Chuyển đổi boolean thành số 1 và 0
      });
    } else {
      // Sắp xếp false (0) trước true (1)
      this.userInPageNumber.sort((a, b) => {
        return +a.status - +b.status; // Chuyển đổi boolean thành số 1 và 0
      });
    }
  }

  // HÀM MỞ FORM THÊM HOẶC SỬA
  userTemp :user | null = null;
  
  userTempAdd:user ={
    user_id: -1,
    username: '',
    password:'',
    email: '',
    role: 'viewer',
    created_at:new Date(),
    status: true
  }
  isFormVisible : boolean = false; // biến xài để xử lí overlay
  isEditing : boolean = false ;  // biến xài để check thêm hay sửa

  openForm(edit:boolean,user:user){
    this.isEditing=edit;
    this.userTemp=user;  
    this.isFormVisible=true;
  }
  handleClose(): void {
    this.isFormVisible = false;
    this.getAllUsers();
  }
  // HÀM THAY ĐỔI SIZE 1 PAGE
  onChange1(event:any){
    this.filterObj.PageNumber=1;
    this.totalPages=Math.ceil(this.users.length / this.filterObj.PageSize);
    this.setDataPhanTrang(this.filterObj.PageNumber);
  }
  // REFRESH
  refresh() { 
    this.filterObj.Name='';
    this.filterObj.Email='';
    this.filterObj.Role='';
    this.filterObj.PageNumber=1;
    this.filterObj.PageSize=5;
    this.getAllUsers();
  }
  
}

