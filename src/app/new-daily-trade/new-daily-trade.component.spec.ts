import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDailyTradeComponent } from './new-daily-trade.component';

describe('NewDailyTradeComponent', () => {
  let component: NewDailyTradeComponent;
  let fixture: ComponentFixture<NewDailyTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDailyTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDailyTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
