import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant, API_URL } from '../constant/constant';
@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/api';
  // GET ALL TAGS
  getAllTags(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tag`);
  }

  // FILTER TAG
  filterTag(name: string, status: string) {
    return this.http.get(`${this.apiUrl}/tag/filter/${name}/${status}`);
  }

  // ADD TAG
  addTag(tag_name: string,  status: boolean) {
    return this.http.post(`${this.apiUrl}/tag/add`, { tag_name,  status });
  }

  // UPDATE TAG (không có hình ảnh)
  updateTag(id: number, tag_name: string, status: boolean) {
    return this.http.put(`${this.apiUrl}/tag/update/${id}`, { tag_name, status });
  }

}