import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatepickerFieldComponent } from './datepicker-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormFieldConfig } from '../../form-builder.model';
import { By } from '@angular/platform-browser';

describe('DatepickerFieldComponent', () => {
  let component: DatepickerFieldComponent;
  let fixture: ComponentFixture<DatepickerFieldComponent>;

  const config: FormFieldConfig = {
    type: 'date',
    name: 'dob',
    label: 'Date of Birth',
    required: true,
    minDate: new Date('2000-01-01'),
    maxDate: new Date('2030-01-01'),
    icon: 'calendar_today'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatepickerFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerFieldComponent);
    component = fixture.componentInstance;
    component.config = config;
    component.control = new FormControl(null);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show icon and label', () => {
    const iconEl = fixture.debugElement.query(By.css('mat-icon')).nativeElement;
    const labelEl = fixture.debugElement.query(By.css('mat-label')).nativeElement;
    expect(iconEl.textContent).toContain('calendar_today');
    expect(labelEl.textContent).toContain('Date of Birth');
  });

  it('should add minDate and maxDate validators on init', () => {
    const testDateBeforeMin = new Date('1999-01-01');
    const testDateAfterMax = new Date('2040-01-01');

    component.formControl.setValue(testDateBeforeMin);
    expect(component.formControl.errors?.['matDatepickerMin']).toBeTruthy();

    component.formControl.setValue(testDateAfterMax);
    expect(component.formControl.errors?.['matDatepickerMax']).toBeTruthy();
  });

  it('should pass validation for a valid date', () => {
    const validDate = new Date('2025-01-01');
    component.formControl.setValue(validDate);
    expect(component.formControl.valid).toBeTrue();
  });

  it('should render validation error messages in UI', () => {
    component.formControl.markAsTouched();
    component.formControl.setErrors({ required: true });
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    expect(errorEl.textContent).toContain('Date of Birth is required');
  });
});
