import { Component, OnInit } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Đảm bảo đường dẫn chính xác

@Component({
  selector: 'app-dangnhap',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './dangnhap.component.html',
  styleUrl: './dangnhap.component.css'
})
export class DangnhapComponent implements OnInit {
    formDangNhap !: FormGroup;

    constructor(private authService: AuthService,private router: Router) {
      this.formDangNhap = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)])
      });
    }



    // INIT
    ngOnInit(): void{


      //this.getAllUsers();



    }






    //Gởi thông tin xuống backend và lấy data
    onLogin() {
      const { username, password } = this.formDangNhap.value;
      this.authService.login(username, password).subscribe({
        next: (data: any) =>{
          if(data.status===1){
            localStorage.setItem('id', data.user.user_id);
            localStorage.setItem('role',data.user.role);
            if(data.user.role === 'admin' || data.user.role==='editor'){
              this.router.navigate(['/admin']);
            }else if(data.user.role === 'viewer'){
              this.router.navigate(['/trangchu']);
            }else{

            }
            //this.router.navigate(['/trangchu']);
          }else{
            alert(data.message);
          }
        }
      }
      );
    }


    /*

    // hàm get tất cả users
    getAllUsers(){
      this.authService.getAllUsers().subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: (error) => {
          console.error('Error fetching articles', error);
        }
      });
    }
    

*/

}
