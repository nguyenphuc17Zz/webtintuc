import { Component, Input, OnInit, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { RouterModule, Router } from '@angular/router';
import { category, user, tag } from '../../interface/user.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUserComponent } from '../form-user/form-user.component';
import { categoryService } from '../../services/category.service';
import { FormCategoryComponent } from '../form-category/form-category.component';
import { CommonModule } from '@angular/common';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { TagService } from '../../services/tag.service';
import { articleService } from '../../services/article.service';
@Component({
  selector: 'app-form-update-article',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, AngularEditorModule, FormsModule],
  templateUrl: './form-update-article.component.html',
  styleUrl: './form-update-article.component.css'
})
export class FormUpdateArticleComponent {
  @Input() isVisible: boolean = false;
  @Input() id_article = -1;
  @Output() close = new EventEmitter<void>();
  id: number = -1;
  formUpdate!: FormGroup;
  categories: any[] = [];
  tags: any[] = [];
  imgThumbnail: any;
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
  baiVietCurrent: any;
  tagCurrent: any;
  constructor(private articleService: articleService, private tagService: TagService
    , private categoryService: categoryService, private router: Router) {

    this.formUpdate = new FormGroup({
      title: new FormControl('', [Validators.required]),
      contentText: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });


  }
  getArticleById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.articleService.getArticleCuTheById(id).subscribe({
        next: (data: any) => {
          resolve(data);
        },
        error: (err) => {
          reject(err); // Thêm reject nếu có lỗi
        }
      });
    });
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      this.tagsNow = [];
      let baivietId = await this.getArticleById(this.id_article);
      this.id = this.id_article;
      this.imgThumbnail = null;
      this.tags = await this.getAllTags();
      this.categories = await this.getAllCategories();
      let b = await this.getArticleTagById(this.id_article);
      this.tagCurrent = b;
      for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < this.tags.length; j++) {
          if (b[i].tag_id === this.tags[j].tag_id) {
            const obj = { tag_id: b[i].tag_id, tag_name: this.tags[j].tag_name }; // Khởi tạo đối tượng
            this.tagsNow.push(obj);
            break;
          }
        }
      }
      this.updateSelectedTags();
      // Khởi tạo lại form với giá trị mặc định từ userTemp
      let a = baivietId[0];
      this.baiVietCurrent = baivietId[0];
      this.formUpdate = new FormGroup({
        title: new FormControl(a.title, [Validators.required]),
        contentText: new FormControl(a.content, [Validators.required]),
        category: new FormControl(a.category_id, [Validators.required])
      });
      let img = document.getElementById('thumbnail_preview') as HTMLImageElement;
      img.src = `http://localhost:3000/img_thumbnail/${a.thumbnail_url}`;
    }
  }


  async onSubmit() {
    if (this.tagsNow.length === 0) {
      alert('Bạn chưa chọn tag nào');
      return;
    }
    let title = this.formUpdate.value['title'].trim();
    let category = this.formUpdate.value['category'];
    let content = this.formUpdate.value['contentText'].trim();
    let tag = [];
    for (let i = 0; i < this.tagsNow.length; i++) {
      tag.push(this.tagsNow[i].tag_id);
    }
    if (this.tagCurrent.length === this.tagsNow.length) {
      let isExist = true;
      for (let i = 0; i < this.tagCurrent.length; i++) {
        if (!this.tagCurrent.some((tag: any) => (Number(tag.tag_id)) === Number(this.tagsNow[i].tag_id))) {
          isExist = false;
        }
      }
      if (isExist) {
        if (title === this.baiVietCurrent.title.trim() && content === this.baiVietCurrent.content.trim()
          && category === this.baiVietCurrent.category_id && this.imgThumbnail === null) {
          alert('Không có gì thay đổi');
          return;
        }
      }
    }
    let idEditor = Number(localStorage.getItem('id'));

    let description = this.formUpdate.value['contentText'];
    let formData = new FormData();
    if (this.imgThumbnail) {
      formData.append('thumbnail', this.imgThumbnail);
    }
    formData.append('title', title);
    formData.append('content', description);
    formData.append('category_id', category);
    formData.append('author_id', idEditor.toString());
    tag.forEach((tagId) => {
      formData.append('tag[]', tagId.toString());  // Thêm từng tag vào formData
    });
    if (this.imgThumbnail) {
      this.articleService.updateArticle(this.id_article, formData).subscribe({
        next: (response) => {
          console.log(response);
          alert(response.message);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.articleService.updateArticleNoThumbnail(this.id_article, formData).subscribe({
        next: (response) => {
          console.log(response);
          alert(response.message);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }



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
  getAllTags(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tagService.getAllTags().subscribe({
        next: (data: any) => {
          resolve(data);
        }
      })
    })
  }
  getAllCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.categoryService.getAllCategories().subscribe({
        next: (data: any) => {
          resolve(data);
        }
      })
    })
  }
  getArticleTagById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.articleService.getArticleeTagById(id).subscribe({
        next: (data: any) => {
          resolve(data);
        }
      })
    })
  }
  // Làm mới tất cả tags
  refreshTags() {
    this.tagsNow = [];
    this.updateSelectedTags(); // Cập nhật lại nội dung trong textarea
  }
  refresh() {
    /*
    (document.getElementById('thumbnail_url') as HTMLInputElement).value = '';
    this.imgThumbnail = null;
    this.formArticle.reset();
    this.tagsNow = [];
    this.updateSelectedTags(); // Cập nhật lại nội dung trong textarea
  */
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


  closeForm() {
    this.close.emit(); // Emit close event
  }
} 
