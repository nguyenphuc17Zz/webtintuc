import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { user } from '../../interface/user.interface';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent implements OnChanges {
  @Input() user: any;

  @Input() isEditing: boolean = false;
  @Input() isVisible: boolean = false;

  formUser !: FormGroup;
  @Output() close = new EventEmitter<void>();

  // BIẾN XÀI ĐỂ KIỂM TRA CÓ SỰ THAY ĐỔI?
  userTemp !: user;
  constructor(private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      // Kiểm tra nếu user tồn tại
      if (!this.isEditing) {
        this.user.status = 1;
      }
      if (this.user) {
        this.userTemp = { ...this.user };

        // Khởi tạo lại form với giá trị mặc định từ userTemp
        this.formUser = new FormGroup({
          username: new FormControl(this.userTemp.username, [Validators.required, Validators.minLength(6)]),
          email: new FormControl(this.userTemp.email, [Validators.required, Validators.email]),
          role: new FormControl(this.userTemp.role, [Validators.required]),
          status: new FormControl(this.userTemp.status, [Validators.required])
        });
      }
    }
  }
  // Đóng form
  closeForm() {
    this.close.emit(); // Emit close event
  }

  onSubmit() {
    if (this.checkForm()) {
      let username = this.formUser.value['username'];
      let email = this.formUser.value['email'];
      let role = this.formUser.value['role'];
      let status = this.formUser.value['status'];
      if (this.user.user_id === -1) {
        // THÊM USER
        this.userService.addUser(username,email,role,status).subscribe({
          next: (data:any) => {
            alert(data.message);
            if(data.status===1){
              this.closeForm();
            }
          }
        })
      } else {
        // EDIT USER
        let idNow = localStorage.getItem('id');
        let id = this.user.user_id;

        if(id===Number(idNow)){
          alert('Không thể sửa của chính mình');
        }else{
        this.userService.editUserById(
          id,username,email,role,status).subscribe({
          next: (data: any) => {
            if (data.status === 1) {
              alert(data.message);
            }
            this.closeForm();

          }
          
        })
        }
        

      }


    }
  }
  // KIỂM TRA CÓ GÌ THAY ĐỔI SO VỚI GỐC HAY KHÔNG
  checkForm() {
    if (this.isEditing) {
      let username = this.formUser.value['username'];
      let email = this.formUser.value['email'];
      let role = this.formUser.value['role'];
      let status = this.formUser.value['status'];
      if (username === this.userTemp.username && email === this.userTemp.email && status === this.userTemp.status
        && role === this.userTemp.role

      ) {
        alert('Không có gì thay đổi');
        return false;
      }
    }

    return true;
  }
}
