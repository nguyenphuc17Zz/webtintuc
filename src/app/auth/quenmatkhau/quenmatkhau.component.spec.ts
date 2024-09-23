import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuenmatkhauComponent } from './quenmatkhau.component';

describe('QuenmatkhauComponent', () => {
  let component: QuenmatkhauComponent;
  let fixture: ComponentFixture<QuenmatkhauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuenmatkhauComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuenmatkhauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
