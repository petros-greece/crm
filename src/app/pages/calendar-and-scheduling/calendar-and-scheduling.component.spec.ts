import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAndSchedulingComponent } from './calendar-and-scheduling.component';

describe('CalendarAndSchedulingComponent', () => {
  let component: CalendarAndSchedulingComponent;
  let fixture: ComponentFixture<CalendarAndSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarAndSchedulingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarAndSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
