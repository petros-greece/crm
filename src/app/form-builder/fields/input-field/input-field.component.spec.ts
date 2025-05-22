import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule // Disable animations for test stability
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;

    component.config = {
      label: 'Username',
      name: 'username',
      type: 'text',
      icon: 'person',
      placeholder: 'Enter username',
      validators: { minLength: 3, maxLength: 10 }
    };

    component.control = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)
    ]);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the input with correct placeholder', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.placeholder).toBe('Enter username');
  });

  it('should display mat-icon when config.icon is set', () => {
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('person');
  });

  it('should show required error when control is touched and empty', () => {
    component.control.markAsTouched();
    component.control.updateValueAndValidity();
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('mat-error'));
    expect(errorMsg.nativeElement.textContent).toContain('Username is required');
  });

  it('should show minlength error when input is too short', () => {
    component.control.setValue('ab');
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('mat-error'));
    expect(errorMsg.nativeElement.textContent).toContain('Minimum length is 3');
  });

  it('should show maxlength error when input is too long', () => {
    component.control.setValue('thisisaverylongusername');
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('mat-error'));
    expect(errorMsg.nativeElement.textContent).toContain('Maximum length is 10');
  });

});
