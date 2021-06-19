import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePurchaseComponent } from './course-purchase.component';

describe('CoursePurchaseComponent', () => {
  let component: CoursePurchaseComponent;
  let fixture: ComponentFixture<CoursePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
