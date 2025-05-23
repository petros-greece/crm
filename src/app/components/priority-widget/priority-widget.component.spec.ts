import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityWidgetComponent } from './priority-widget.component';
import { By } from '@angular/platform-browser';

describe('PriorityWidgetComponent', () => {
  let component: PriorityWidgetComponent;
  let fixture: ComponentFixture<PriorityWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityWidgetComponent]  // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should return 0 for fillPercentage when priority is not in the list', () => {
    component.priority = 'Nonexistent Priority';
    const percentage = component.fillPercentage;
    expect(percentage).toBe(0);
  });

  const testCases = [
    { priority: 'Very Low', expectedColor: 'bg-green-500', expectedPercentage: 100 / 6 },
    { priority: 'Low', expectedColor: 'bg-lime-500', expectedPercentage: 2 * 100 / 6 },
    { priority: 'Medium', expectedColor: 'bg-amber-400', expectedPercentage: 3 * 100 / 6 },
    { priority: 'High', expectedColor: 'bg-orange-500', expectedPercentage: 4 * 100 / 6 },
    { priority: 'Very High', expectedColor: 'bg-orange-600', expectedPercentage: 5 * 100 / 6 },
    { priority: 'Critical', expectedColor: 'bg-red-500', expectedPercentage: 6 * 100 / 6 },
    { priority: 'Unknown', expectedColor: 'bg-gray-400', expectedPercentage: 0 },
  ];

  testCases.forEach(({ priority, expectedColor, expectedPercentage }) => {

    it(`should set correct color and width for priority "${priority}"`, () => {
      component.priority = priority;
      component.ngOnChanges({
        priority: {
          currentValue: priority,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      });
      fixture.detectChanges();

      const div = fixture.debugElement.query(By.css('div > div > div > div'));
      expect(div.nativeElement.classList).toContain(expectedColor);

      const width = parseFloat(div.nativeElement.style.width);
      expect(width).toBeCloseTo(expectedPercentage, 0);  // 0 decimals, can change for more precision
    });
  });
});
