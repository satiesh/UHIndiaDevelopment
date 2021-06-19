import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBuyComponent } from './course-buy.component';

describe('CourseBuyComponent', () => {
  let component: CourseBuyComponent;
  let fixture: ComponentFixture<CourseBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
