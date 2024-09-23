import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-quenmatkhau',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './quenmatkhau.component.html',
  styleUrl: './quenmatkhau.component.css'
})
export class QuenmatkhauComponent {
    formQuenmk !: FormGroup;
    

    constructor(private authService: AuthService ,private router: Router) {
      this.formQuenmk = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(6)]),
        email: new FormControl('', [Validators.required, Validators.email]), 
        newpassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
        nhaplaipass: new FormControl('', [Validators.required])

      }, { validators: this.passwordMatchValidator });  // Thêm validator cho việc so sánh mật khẩu
        
     }

     // HÀM KIỂM TRA NHẬP LẠI MẬT KHẨU CÓ CHÍNH XÁC KO 
     passwordMatchValidator(formGroup: AbstractControl) {
      let newpass = formGroup.get('newpassword')?.value;
      let nhaplaipass = formGroup.get('nhaplaipass')?.value;
      if(newpass!==nhaplaipass){
        return { passwordMismatch: true };
      }
      return null;
    }
     // submit form quên mật khẩu
     submit(){
      const {username,email}=this.formQuenmk.value;
      const password = this.formQuenmk.value['newpassword'];

      this.authService.quenmatkhau(username,email,password).subscribe({
        next:(data:any)=>{
          alert(data.message);
          if(data.trangthai===1){
            this.router.navigate(['/dangnhap']);
          }
        }
      })
      
     }
}
