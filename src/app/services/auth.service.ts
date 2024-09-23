import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant,API_URL } from '../constant/constant';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLogin = API_URL+Constant.API_METHOD.LOGIN;
  private apiUrlUsers= API_URL+Constant.API_METHOD.GET_ALL_USERS;
  apiUrlQuenMatkhau = API_URL+Constant.API_METHOD.QUENMATKHAU;
  apiUrlDangki = API_URL+Constant.API_METHOD.DANGKI;
  constructor(private http: HttpClient) {}

  
  // kiểm tra đăng nhập
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrlLogin, { username, password });
  }


  // get tất cả user
  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrlUsers);
  }


  // quên mật khẩu
  quenmatkhau(username:string, email:string, password:string) :Observable<any>{
    return  this.http.post<any>(this.apiUrlQuenMatkhau,{username,email,password});
  }

  // đăng kí
  dangki(username:string, email:string,password:string):Observable<any>{
    return this.http.post<any>(this.apiUrlDangki,{username,email,password});
  }
  
}