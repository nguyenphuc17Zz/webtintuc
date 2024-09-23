import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dangki',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './dangki.component.html',
  styleUrl: './dangki.component.css'
})
export class DangkiComponent {
      formDangki !:FormGroup;
      constructor(private authService: AuthService ,private router: Router) {
        this.formDangki = new FormGroup({
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
      const {username,email}=this.formDangki.value;
      const password = this.formDangki.value['newpassword'];

      this.authService.dangki(username,email,password).subscribe({
        next:(data:any)=>{
          alert(data.message);
          if(data.status===1){
            this.router.navigate(['/dangnhap']);
          }
        }
      })
      
     }
}
