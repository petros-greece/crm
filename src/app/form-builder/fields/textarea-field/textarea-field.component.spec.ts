import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TextareaFieldComponent } from './textarea-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FormFieldConfig } from '../../form-builder.model';


describe('TextareaFieldComponent', () => {
  let component: TextareaFieldComponent;
  let fixture: ComponentFixture<TextareaFieldComponent>;

  const createComponent = (config: Partial<FormFieldConfig>, control?: FormControl) => {
    component.config = {
      type: 'textarea',
      name: 'bio',
      label: 'Biography',
      ...config
    };
    component.control = control ?? new FormControl('');
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TextareaFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    createComponent({});
    expect(component).toBeTruthy();
  });

  it('should render label text', () => {
    createComponent({ label: 'User Bio' });
    const label = fixture.debugElement.query(By.css('mat-label'));
    expect(label.nativeElement.textContent).toContain('User Bio');
  });

  it('should show icon if provided', () => {
    createComponent({ icon: 'person' });
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('person');
  });

  it('should use placeholder if provided', () => {
    createComponent({ placeholder: 'Enter your bio' });
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.attributes['placeholder']).toBe('Enter your bio');
  });

  it('should default to 5 rows if none specified', () => {
    createComponent({});
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.attributes['rows']).toBe('5');
  });

  it('should use rows config if provided', () => {
    createComponent({ rows: 10 });
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.attributes['rows']).toBe('10');
  });

  it('should show required error', () => {
    const control = new FormControl('', Validators.required);
    createComponent({ required: true }, control);
    control.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('mat-error span'));
    expect(error.nativeElement.textContent).toContain('Biography is required');
  });

  it('should show minlength error', () => {
    const control = new FormControl('Hi', [Validators.minLength(5)]);
    createComponent({}, control);
    control.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('mat-error span'));
    expect(error.nativeElement.textContent).toContain('Minimum length is 5');
  });

  it('should show maxlength error', () => {
    const control = new FormControl('A'.repeat(101), [Validators.maxLength(100)]);
    createComponent({}, control);
    control.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('mat-error span'));
    expect(error.nativeElement.textContent).toContain('Maximum length is 100');
  });

  it('should show pattern error', () => {
    const control = new FormControl('12345', [Validators.pattern(/^[A-Za-z\s]+$/)]);
    createComponent({}, control);
    control.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('mat-error span'));
    expect(error.nativeElement.textContent).toContain('Invalid format');
  });

  it('should throw error if config or control is missing', () => {
    expect(() => fixture.detectChanges()).toThrowError(
      'Field component requires config and control input'
    );
  });
});
