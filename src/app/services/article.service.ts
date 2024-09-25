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
    // GET ARTICLE BY ID
    getArticleById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/getByIdEditor/${id}`);
    }
    // MY ARTICLE FORM FILTER
    filterMyArticle(name: string, category: string, status: string, id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/filterMyArticle/${id}/${name}/${category}/${status}`);
    }
    updateArticleStatus(article_id: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/article/updateStatus/${article_id}`, { status });
    }
    // BÀI VIẾT CỤ THỂ
    getArticleCuTheById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/getArticleCuTheById/${id}`);
    }
    // ARTICLE TAG BY ID
    getArticleeTagById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/getArticletTagCuTheById/${id}`);
    }
    // UPDATE ARTICLE
    updateArticle(
        articleId: number,
        title: string,
        content: string,
        categoryid: number,
        thumbnail: string,
        tags: number[] // Mảng các tag ID
    ): Observable<any> {
        return this.http.post(`${this.apiUrl}/article/update/${articleId}`, {
            title, content, categoryid, thumbnail, tags
        });
    }
    // GET ALL ARTICLE
    getAllArticles2(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/article/getAll`);
    }
    // MY ARTICLE FORM FILTER
    filterMyArticle2(name: string, category: string, status: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/filterMyArticle2/${name}/${category}/${status}`);
    }
    getAllArticlesDaDuyet(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/article/${'daduyet'}`);
    }
    // BÀI VIẾT CỤ THỂ
    getArticleAllById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/getArticleById/${id}`);
    }
    // Lấy bài viết theo category_id
    getArticlesByCategory(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/articleCate/${id}`);
    }
    // Lấy bài viết theo tag_id
    getArticlesByTag(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/articleTag/${id}`);
    }
    getArticleTagById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/article/getArticletTagById/${id}`);
      }
}