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



    const [newName, success] = await this.generateImgThumbnail();
    if (success) {
      let isImgContentSuccess = await this.handleImages(this.formArticle.value['contentText']);
      let contentText = this.formArticle.value['contentText'];
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentText; // Giả sử `content` chứa HTML
      let contentFinal = tempDiv.innerHTML;
      if (isImgContentSuccess) {
        this.articleService.addArticle(title, contentFinal, idEditor, category, status, newName, tag).
          subscribe({
            next: (data: any) => {
              alert(data.message);
              if (data.status === 1) {
                this.refresh();
              } else {
                alert('Thêm bài viết thất bại');
              }
            }
          })
      } else {
        alert('Upload hình ảnh thất bại');
      }

    } else {
      alert('Lỗi khi tạo ảnh thumbnail');
      return;
    }

  }


  ngOnInit() {
    this.getAllTags();
    this.getAllCategories();
    this.getAllArticle();
  }
  getAllArticle(){
    this.articleService.getAllArticles().subscribe({next:(data:any)=>{
      console.log(data);
    }})
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


  async urlToBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  // Gửi ảnh lên backend
  sendImgArticleToBackend(formData: FormData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.articleService.uploadImageArticle(formData).subscribe({
        next: (data: any) => {
          if (data.status === 1) {
            console.log(data.message);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error('Lỗi khi upload hình ảnh:', err);
          reject(false);
        }
      });
    });
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
  generateRandomNumberString(length: number): string {
    const characters = '0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result + '.jpg';
  }
  sendImgArticalToBackend(formdata1: FormData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.articleService.uploadImageArticle(formdata1).subscribe({
        next: (data: any) => {
          if (data.status === 1) {
            console.log(data.message);
            resolve(true);
            return;
          }
          resolve(false);
        }
      }
      );
    })
  }
  getAllImageName(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let result: string[] = []; // Khởi tạo mảng rỗng
      this.articleService.getAllArticles().subscribe({
        next: (data: any) => {
          if (data.length === 0) {
            resolve(result); // Nếu không có dữ liệu, trả về mảng rỗng
            return;
          }
  
          // Sử dụng vòng lặp for thông thường
          for (let j = 0; j < data.length; j++) {
            const article = data[j]; // Lấy bài viết
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = article.content; // Giả sử `content` chứa HTML
  
            const images = tempDiv.getElementsByTagName('img');
            // Lặp qua các ảnh và lưu vào mảng
            for (let i = 0; i < images.length; i++) {
              result.push(images[i].src); // Lưu đường dẫn ảnh vào mảng
            }
          }
  
          resolve(result); // Trả về kết quả cuối cùng
        },
        error: (err) => {
          reject(err); // Trả về lỗi nếu có
        }
      });
    });
  }

  async handleImages(content: string): Promise<boolean> {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const images = tempDiv.getElementsByTagName('img');

    if (images.length === 0) {
      console.log('No images found in content');
      return true; // Trả lại content ban đầu nếu không có hình ảnh
    }

    let allImageName = await this.getAllImageName();

    for (let i = 0; i < images.length; i++) {
      const imgSrc = images[i].src; // Lấy đường dẫn hình ảnh
      let imgName = '';
      let isCondition = false;

      while (!isCondition) {
        imgName = this.generateRandomNumberString(9);
        if (!allImageName.includes(imgName)) {
          allImageName.push(imgName);
          isCondition = true;
        }
      }

      images[i].src = `http://localhost:3000/img_article/${imgName}`;

      const imgBlob = await this.urlToBlob(imgSrc);
      let form = new FormData();
      form.append('file', imgBlob);
      form.append('tenFile', imgName);

      let sendImgArtical = await this.sendImgArticalToBackend(form);
      if (!sendImgArtical) {
        alert('Có lỗi xảy ra khi thêm hình ảnh');
        return false; // Trả lại content ban đầu nếu có lỗi
      }
    }

    this.formArticle.patchValue({ contentText: tempDiv.innerHTML });
    return true;
  }

  // Gọi hàm và cập nhật form

  sendThumbnailToBackend(form: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.articleService.uploadThumbnail(form).subscribe({
        next: (data: any) => {
          if (data.status === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      })
    })
  }
  async generateImgThumbnail(): Promise<[string, boolean]> {
    let newName = await this.newNameForFileImage();
    let form = new FormData();
    form.append('file', this.imgThumbnail);
    form.append('tenFile', newName);

    let a = await this.sendThumbnailToBackend(form);

    return new Promise((resolve, reject) => {
      if (a) {
        resolve([newName, true]);
      } else {
        resolve([newName, false]);
      }
    });
  }

  newNameForFileImage(): Promise<string> {
    let tenFileImage = '';
    let isExistNameImage = true;
    return new Promise((resolve, reject) => {
      this.articleService.getAllArticles().subscribe({
        next: (data: any) => {
          while (isExistNameImage) {
            tenFileImage = this.generateRandomNumberString(9); // Thêm .jpg vào tên file
            isExistNameImage = false;
            for (let i = 0; i < data.length; i++) {
              if (data[i].thumbnail_url === tenFileImage) {
                isExistNameImage = true;
              }
            }

          }
          resolve(tenFileImage);
          return;
        }
      })
    })
  }

}
