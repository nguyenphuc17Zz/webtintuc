import { Component, OnInit } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  user: any = {};
  role : any = localStorage.getItem('role');
  constructor(private userService: UserService,private router: Router){

  }
  ngOnInit(): void {
      this.getUserById();
  }
  deleteLs(){
    localStorage.clear();
  }

  getUserById(){
    let id = localStorage.getItem('id');
    if(id){
      this.userService.getUserById(id).subscribe({
        next:(data:any)=>{
          this.user=data.user;
        }
      })
    }
    
  }

  goToEditProFile(){
    this.router.navigate(['/admin/editprofile']);
  }
}
