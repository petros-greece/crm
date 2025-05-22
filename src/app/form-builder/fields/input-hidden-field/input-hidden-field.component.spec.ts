import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputHiddenFieldComponent } from './input-hidden-field.component';
import { FormFieldConfig } from '../../form-builder.model';
import { By } from '@angular/platform-browser';

describe('InputHiddenFieldComponent', () => {
  let component: InputHiddenFieldComponent;
  let fixture: ComponentFixture<InputHiddenFieldComponent>;

  const config: FormFieldConfig = {
    type: 'hidden',
    name: 'secretToken',
    label: '',
    value: 'abc123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InputHiddenFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputHiddenFieldComponent);
    component = fixture.componentInstance;
    component.config = config;
    component.control = new FormControl(config.value);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a hidden input field', () => {
    const input = fixture.debugElement.query(By.css('input[type="hidden"]'));
    expect(input).toBeTruthy();
  });

  it('should bind the control value to the input', () => {
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('abc123');
  });

  it('should update control value when input value changes', () => {
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'newSecret';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.control.value).toBe('newSecret');
  });
});
