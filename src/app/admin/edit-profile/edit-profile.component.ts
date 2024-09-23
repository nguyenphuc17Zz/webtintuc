import { Component, OnInit } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AbstractControl, FormControl, FormGroup, FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{
  user : any ={};
  formEdit !:FormGroup;

  constructor(private userService: UserService,private router: Router){
    this.formEdit = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]), 
      role: new FormControl('', [Validators.required,]),

    });
  }

 updateForm() {
  this.formEdit.patchValue({
    email: this.user.email,
    password: this.user.password,
    username: this.user.username,
    role: this.user.role

  });
}

  ngOnInit(): void {
    this.getUserById();

  }
  getUserById(){
    let id = localStorage.getItem('id');
    if(id){
      this.userService.getUserById(id).subscribe({
        next:(data:any)=>{
          this.user=data.user;
          this.updateForm();

        }
      })
    }
  }
  onEdit(){
    if(this.user.password===this.formEdit.value['password'] && this.user.email===this.formEdit.value['email']){
      alert('Không có gì thay đổi');
    }else{
      let id = localStorage.getItem('id');
      if(id){
        let password = this.formEdit.value['password'];
        let email = this.formEdit.value['email'];
        this.userService.editProfile(id,email,password).subscribe({
          next:(data:any)=>{
            alert('Cập nhật thành công');
            if(data.status===1){
              this.router.navigate(['/admin/dashboard']);
            }
          }
        })
      }
      
    }
  }
}
