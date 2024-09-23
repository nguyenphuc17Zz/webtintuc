import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant,API_URL } from '../constant/constant';
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api'; 
    apiUrlEditUser = this.apiUrl+'/edituser';
    apiUrlAddUser=this.apiUrl+'/adduser';
    constructor(private http: HttpClient) {}

    // GET USER BY ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`);
  }

  // EDIT PROFILE
  editProfile(id: string, email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/editprofile`, { id, email, password });
  }
  
  // GET ALL USERS
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getallusers`);
  }
  // FILTER
  filterUser(name: string, email: string, role: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filteruser/${name}/${email}/${role}`);
  }

  //ADMIN EDIT USER 
  editUserById(id:number, username:string , email:string, role:string , status:number){
    return this.http.post(`${this.apiUrlEditUser}`, {id, username, email, role, status });
  }
  //ADMIN EDIT USER 
  addUser(username:string , email:string, role:string , status:number){
    return this.http.post(`${this.apiUrlAddUser}`, { username, email, role, status });
  }
}