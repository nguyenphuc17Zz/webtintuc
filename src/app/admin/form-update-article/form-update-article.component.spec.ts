import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdateArticleComponent } from './form-update-article.component';

describe('FormUpdateArticleComponent', () => {
  let component: FormUpdateArticleComponent;
  let fixture: ComponentFixture<FormUpdateArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUpdateArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUpdateArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
