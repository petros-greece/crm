import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';
import { By } from '@angular/platform-browser';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent] 
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header text', () => {
    component.header = 'My Page Title';
    fixture.detectChanges();
    const headerElement = fixture.nativeElement.querySelector('h2');
    expect(headerElement.textContent).toContain('My Page Title');
  });

  it('should show the icon if provided', () => {
    component.header = 'Dashboard';
    component.icon = 'dashboard';
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconEl).toBeTruthy();
    expect(iconEl.nativeElement.textContent).toContain('dashboard');
  });

  it('should not show the icon if not provided', () => {
    component.header = 'No Icon Test';
    component.icon = undefined;
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconEl).toBeNull();
  });
});
