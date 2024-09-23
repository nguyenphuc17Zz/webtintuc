import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TagService } from '../../services/tag.service';
@Component({
  selector: 'app-form-tag',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './form-tag.component.html',
  styleUrl: './form-tag.component.css'
})
export class FormTagComponent {
  @Input() isEditing: boolean = false;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  formTag !: FormGroup;
  @Input() tag: any;
  constructor(private tagService: TagService) { };
  closeForm() {
    this.close.emit(); // Emit close event

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      if (this.isEditing) {
        this.tag.status = this.tag.status === 1 ? true : false;
      }
      // Khởi tạo lại form với giá trị mặc định từ userTemp
      this.formTag = new FormGroup({
        tag_name: new FormControl(this.tag.tag_name, [Validators.required]),
        status: new FormControl(this.tag.status, [Validators.required])
      });

    }
  }

  onSubmit() {
    let tag_id = this.tag.tag_id;
    let tag_name = this.formTag.value['tag_name'];
    let status = this.formTag.value['status'];
    if (!this.isEditing) {
      this.tagService.addTag(tag_name, status).subscribe({
        next:
          (data: any) => {
            alert(data.message);
            if (data.status === 1) {
              this.closeForm();
            }
          }
      })
    } else {
      if (tag_name.toLowerCase() === this.tag.tag_name.toLowerCase() &&
        status === this.tag.status
      ) {
        alert('Không có gì thay đổi');
        return;
      } else {
        this.tagService.updateTag(tag_id, tag_name, status).subscribe({
          next: (data: any) => {
            alert(data.message);
            if (data.status === 1) {
              this.closeForm();
            }
          }
        })
      }

    }
  }

}
