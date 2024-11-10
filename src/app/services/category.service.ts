import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant, API_URL } from '../constant/constant';
@Injectable({
    providedIn: 'root'
})
export class categoryService {
    constructor(private http: HttpClient) { }
    private apiUrl = 'http://localhost:3000/api';

    // GET ALL CATEGORIES
    getAllCategories(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/category`);
    }
    // FILTER  
    filterCategory(name: string, status: string) {
        return this.http.get(`${this.apiUrl}/category/filter/${name}/${status}`);
    }
    // UPLOAD IMAGE
    // Hàm để upload hình ảnh
    uploadImage(formData: FormData): Observable<any> {
        // Gửi request POST với dữ liệu FormData
        return this.http.post(`${this.apiUrl}/category/uploadImage`, formData);
    }
    // ADD CATE
    addCategory(formData: FormData) {
        return this.http.post(`${this.apiUrl}/category/add`, formData);
    }
    // Cập nhật thể loại không có hình ảnh
    updateCategoryWithoutImage(id: number, category_name: string, description: string, status: boolean) {
        return this.http.put(`${this.apiUrl}/category/update/${id}`, { category_name, description, status });
    }

    // Cập nhật thể loại có hình ảnh
    updateCategoryWithImage(id: number,formData: FormData) {
        return this.http.put(`${this.apiUrl}/category/updateImg/${id}`, formData);
    }
     // GET ALL CATEGORIES
     getAllCategoriesUser(status:number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/category/${status}`);
    }
}