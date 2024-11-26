import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { categoryService } from '../../services/category.service';
import { category } from '../../interface/user.interface';
@Component({
  selector: 'app-form-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.css'
})
export class FormCategoryComponent {
  @Input() isEditing: boolean = false;
  @Input() isVisible: boolean = false;
  formCategory !: FormGroup;
  imgCategory: any = null;
  @Output() close = new EventEmitter<void>();

  /*
  category : category={
    category_id:-1,
    category_name:'',
    description:'',
    image_cate:'',
    status:true
  } ;
   */
  @Input() category: any;



  constructor(private categoryService: categoryService) { };
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      if (this.isEditing) {
        this.category.status = this.category.status === 1 ? true : false;
      }
      this.imgCategory = null;
      // Khởi tạo lại form với giá trị mặc định từ userTemp
      this.formCategory = new FormGroup({
        category_name: new FormControl(this.category.category_name, [Validators.required]),
        description: new FormControl(this.category.description, [Validators.required]),
        image_cate: new FormControl(this.category.image_cate, [Validators.required]),
        status: new FormControl(this.category.status, [Validators.required])
      });

    }
  }




  // Đóng form
  closeForm() {
    this.close.emit(); // Emit close event
  }


  // SUBMIT 
  async onSubmit() {
    const name = this.formCategory.value['category_name'].trim();
    const description = this.formCategory.value['description'].trim();
    let status = this.formCategory.value['status'];

    if (!this.isEditing) {
      status = status === true ? 1 : 0;
      const isNameTrung = await this.checkTenTrung();
      if (!isNameTrung) {
        alert('Tên thể loại đã tồn tại');
        return;
      } else {
        if (this.imgCategory) {
          let formData = new FormData();
          formData.append('image', this.imgCategory);
          formData.append('name', name);
          formData.append('description', description);
          formData.append('status', status);
          formData.append('folder', 'category'); // Thêm 'folder' để chỉ định thư mục lưu trữ
          this.categoryService.addCategory(formData).subscribe({
            next: (data: any) => {
              alert(data.message);
              if (data.status === 1) {
                this.close.emit();
              }
            }
          });

        } else {
          alert('Chưa chọn file hình ảnh nào');
        }
      }
    } else {
      if (!this.imgCategory && (
        name.toLowerCase() === this.category.category_name.toLowerCase() &&
        description.toLowerCase() === this.category.description.toLowerCase() &&
        status === this.category.status
      )) {
        alert('Không có gì thay đổi');
      } else {
        status = status === true ? 1 : 0;
        if (!this.imgCategory) {
          // Cập nhật không có hình ảnh
          this.categoryService.updateCategoryWithoutImage(this.category.category_id, name, description, status).subscribe({
            next: (data: any) => {
              alert(data.message);
              if (data.status === 1) {
                this.close.emit();
              }
            }
          });
        } else {
          let id = this.category.category_id;
          let formData = new FormData();
          formData.append('id', id);
          formData.append('image', this.imgCategory);
          formData.append('name', name);
          formData.append('description', description);
          formData.append('status', status);
          this.categoryService.updateCategoryWithImage(id, formData).subscribe({
            next: (data: any) => {
              alert(data.message);
              if (data.status === 1) {
                this.close.emit();
              }
            }
          });

        }
      }
    }
  }




  checkTenTrung(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let name = this.formCategory.value['category_name'].trim().toLowerCase();
      this.categoryService.getAllCategories().subscribe({
        next: (data: any) => {
          for (let cate of data) {
            let cate_name = cate.category_name.toLowerCase();
            if (cate_name === name) {
              resolve(false);  // Tên bị trùng
              return;
            }
          }
          resolve(true);  // Tên không trùng
          return;
        },
        error: (err: any) => {
          reject(err);
        }
      });

    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.imgCategory = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = document.getElementById('category-image') as HTMLImageElement;
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);

    }
  }
 
  

}
