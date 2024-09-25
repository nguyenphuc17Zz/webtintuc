import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitietbaivietComponent } from './chitietbaiviet.component';

describe('ChitietbaivietComponent', () => {
  let component: ChitietbaivietComponent;
  let fixture: ComponentFixture<ChitietbaivietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChitietbaivietComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChitietbaivietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
