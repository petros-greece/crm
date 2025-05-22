import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideToggleFieldComponent } from './slide-toggle-field.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FormFieldConfig } from '../../form-builder.model';

describe('SlideToggleFieldComponent', () => {
  let component: SlideToggleFieldComponent;
  let fixture: ComponentFixture<SlideToggleFieldComponent>;

  const createComponent = (config: Partial<FormFieldConfig>, control?: FormControl) => {
    component.config = {
      type: 'slide-toggle',
      name: 'terms',
      label: 'Accept Terms',
      ...config
    };

    component.control = control || new FormControl(false);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SlideToggleFieldComponent,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideToggleFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    createComponent({});
    expect(component).toBeTruthy();
  });

  it('should show the label text', () => {
    createComponent({ label: 'Enable Dark Mode' });
    const toggle = fixture.debugElement.query(By.css('mat-slide-toggle'));
    expect(toggle.nativeElement.textContent).toContain('Enable Dark Mode');
  });

  it('should show an icon if specified in config', () => {
    createComponent({ icon: 'check_circle' });
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('check_circle');
  });

  it('should not show an icon if not specified', () => {
    createComponent({});
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeFalsy();
  });

  it('should show validation error when required and not checked', () => {
    const control = new FormControl(null, Validators.requiredTrue);
    createComponent({ required: true }, control);

    control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('mat-error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent.trim()).toBe('Accept Terms is required');
  });

  it('should not show error if valid', () => {
    const control = new FormControl(true, Validators.requiredTrue);
    createComponent({ required: true }, control);

    control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('mat-error'));
    expect(error).toBeFalsy();
  });

  it('should throw error if config or control not passed', () => {
    expect(() => fixture.detectChanges()).toThrowError(
      'Field component requires config and control input'
    );
  });
  
});
