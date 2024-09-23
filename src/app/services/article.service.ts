import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class articleService {
    constructor(private http: HttpClient) { }
    private apiUrl = 'http://localhost:3000/api';

    // UPLOAD IMAGE
    // Hàm để upload hình ảnh
    uploadThumbnail(formData: FormData): Observable<any> {
        // Gửi request POST với dữ liệu FormData
        return this.http.post(`${this.apiUrl}/thumbnail/uploadImage`, formData);
    }
    // GET ALL CATEGORIES
    getAllArticles(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/article`);
    }
    uploadImageArticle(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/article/uploadImage`, formData);
    }
    // ADD ARTICLE
    // ADD ARTICLE
    addArticle(
        title: string,
        content: string,
        authorid: number,
        categoryid: number,
        status: string,
        thumbnail: string,
        tags: number[] // Mảng các tag ID
    ): Observable<any> {
        return this.http.post(`${this.apiUrl}/article/add`, {
            title, content, authorid, categoryid, status, thumbnail, tags
        });
    }


}