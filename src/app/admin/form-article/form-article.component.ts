import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { categoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { articleService } from '../../services/article.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { LayoutComponent } from '../layout/layout.component';
@Component({
  selector: 'app-form-article',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, AngularEditorModule, LayoutComponent],
  templateUrl: './form-article.component.html',
  styleUrl: './form-article.component.css'
})
export class FormArticleComponent implements OnInit {
  imgThumbnail !: any;
  formArticle!: FormGroup;
  tags: any[] = [];
  categories: any[] = [];
  tagsNow: { tag_id: number; tag_name: string }[] = [];
  selectedTags: string = ''; // Biến để lưu nội dung cho textarea
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '45rem',
    minHeight: '5rem',
    placeholder: 'Nhập nội dung ở đây...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',

  };
  constructor(private articleService: articleService, private tagService: TagService
    , private categoryService: categoryService, private router: Router) {

    this.formArticle = new FormGroup({
      title: new FormControl('', [Validators.required]),
      contentText: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });

  }


  async onSubmit() {
    if (!this.imgThumbnail) {
      alert('Bạn chưa chọn thumbnail');
      return;
    }
    if (this.tagsNow.length === 0) {
      alert('Bạn chưa chọn tag nào');
      return;
    }
    let title = this.formArticle.value['title'];
    let status = this.formArticle.value['status'];
    let category = this.formArticle.value['category'];
    let idEditor = Number(localStorage.getItem('id'));
    let tag = [];
    for (let i = 0; i < this.tagsNow.length; i++) {
      tag.push(this.tagsNow[i].tag_id);
    }
    let description = this.formArticle.value['contentText'];
    let formData = new FormData();
    formData.append('thumbnail', this.imgThumbnail);
    formData.append('title', title);
    formData.append('content', description);
    formData.append('author_id', idEditor.toString());
    formData.append('status', status);
    formData.append('category_id', category);
    tag.forEach((tagId) => {
      formData.append('tag[]', tagId.toString());  // Thêm từng tag vào formData
    });

    this.articleService.addArticle(formData).subscribe({
      next: (response) => {
        console.log(response);
        alert(response.message);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  ngOnInit() {
    this.getAllTags();
    this.getAllCategories();
  }

  changeTag(event: any) {
    let selectedTagId = Number(event.target.value); // Lấy giá trị `tag_id` đã chọn và chuyển đổi thành số
    let name: string = ''; // Khai báo biến `name` với kiểu là string

    // Tìm tên tag dựa trên `tag_id` đã chọn
    for (let i = 0; i < this.tags.length; i++) {
      if (Number(this.tags[i].tag_id) === selectedTagId) {
        name = this.tags[i].tag_name;
        break; // Dừng vòng lặp khi tìm thấy
      }
    }

    // Kiểm tra xem tag đã tồn tại trong `tagsNow` chưa
    let isExist = this.tagsNow.some(tag => tag.tag_id === selectedTagId);

    // Nếu tag chưa tồn tại, thêm vào
    if (!isExist && name) {
      const obj = { tag_id: selectedTagId, tag_name: name }; // Khởi tạo đối tượng
      this.tagsNow.push(obj);
      this.updateSelectedTags(); // Cập nhật lại nội dung trong textarea
    }
  }
  getAllTags() {
    this.tagService.getAllTags().subscribe({
      next: (data: any) => {
        this.tags = data;
      }
    })
  }
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      }
    })
  }
  // Làm mới tất cả tags
  refreshTags() {
    this.tagsNow = [];
    this.updateSelectedTags(); // Cập nhật lại nội dung trong textarea

  }
  refresh() {
    (document.getElementById('thumbnail_url') as HTMLInputElement).value = '';
    this.imgThumbnail = null;
    this.formArticle.reset();
    this.tagsNow = [];
    this.updateSelectedTags(); // Cập nhật lại nội dung trong textarea
  }
  // Cập nhật nội dung cho textarea
  updateSelectedTags() {
    this.selectedTags = this.tagsNow.map(tag => tag.tag_name).join(', '); // Kết hợp tên tag thành chuỗi
  }




  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.imgThumbnail = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = document.getElementById('thumbnail_preview') as HTMLImageElement;
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);

    }
  }









}
