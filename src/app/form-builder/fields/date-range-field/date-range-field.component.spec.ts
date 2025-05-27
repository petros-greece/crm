import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DateRangeFieldComponent } from './date-range-field.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormFieldConfig } from '../../form-builder.model';
import { By } from '@angular/platform-browser';

describe('DateRangeFieldComponent', () => {
  let component: DateRangeFieldComponent;
  let fixture: ComponentFixture<DateRangeFieldComponent>;

  const config: FormFieldConfig = {
    type: 'range-picker',
    name: 'dateRange',
    label: 'Select Range',
    icon: 'calendar_today',
    required: true
  };

  const formGroup = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DateRangeFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeFieldComponent);
    component = fixture.componentInstance;
    component.config = config;
    component.control = formGroup;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should throw if control is not a FormGroup', () => {
    const brokenComponent = TestBed.createComponent(DateRangeFieldComponent).componentInstance;
    brokenComponent.config = config;
    brokenComponent.control = new FormControl(null) as any;

    expect(() => brokenComponent.ngOnInit()).toThrowError('DateRangeFieldComponent requires a FormGroup control');
  });

  it('should initialize start and end controls', () => {
    expect(component.startControl).toBeTruthy();
    expect(component.endControl).toBeTruthy();
  });

  it('should validate required fields if configured', () => {
    component.startControl.setValue(null);
    component.endControl.setValue(null);
    component.control.markAllAsTouched();
    fixture.detectChanges();

    expect(component.startControl.hasError('required')).toBeTrue();
    expect(component.endControl.hasError('required')).toBeTrue();
  });

  it('should validate end date is after start date', () => {
    component.startControl.setValue(new Date('2025-01-10'));
    component.endControl.setValue(new Date('2025-01-05'));
    component.control.updateValueAndValidity();
    fixture.detectChanges();
    const errors = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    console.log(errors)
    expect(component.control.hasError('endBeforeStart')).toBeTrue();
    //expect(errors.textContent).toContain('Please enter valid dates')
  });

  it('should validate invalid date formats and display the corresponding error message', () => {
    component.startControl.setValue('invalid date');
    component.endControl.setValue(new Date());
    component.control.updateValueAndValidity();
        component.control.markAllAsTouched();
    fixture.detectChanges();

    const errors = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    expect(component.control.hasError('invalidDates')).toBeTrue();
    expect(errors.textContent).toContain('Please enter valid dates')
  });

  it('should not set errors if dates are valid and in correct order', () => {
    component.startControl.setValue(new Date('2025-01-01'));
    component.endControl.setValue(new Date('2025-01-05'));
    component.control.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.control.errors).toBeNull();
  });

  it('should render label and icon if provided', () => {
    const label = fixture.debugElement.query(By.css('mat-label')).nativeElement;
    const icon = fixture.debugElement.query(By.css('mat-icon')).nativeElement;
    expect(label.textContent).toContain('Select Range');
    expect(icon.classList).toContain('mat-icon');
  });

});
