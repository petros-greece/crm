import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderRangeFieldComponent } from './slider-range-field.component';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SliderRangeFieldComponent', () => {
  let component: SliderRangeFieldComponent;
  let fixture: ComponentFixture<SliderRangeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SliderRangeFieldComponent,
        ReactiveFormsModule,
        MatSliderModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SliderRangeFieldComponent);
    component = fixture.componentInstance;
  });

  // Helper to initialize component with config and control
  function initWithConfig(config: any = {}, control?: FormGroup) {
    component.config = {
      type: 'slider-range',
      name: 'range',
      label: 'Select Range',
      validators: {
        min: 10,
        max: 90,
      },
      icon: 'tune',
      step: 5,
      ...config
    };

    component.control = control ?? new FormGroup({});
    fixture.detectChanges();
  }

  it('should create the component', () => {
    initWithConfig();
    expect(component).toBeTruthy();
  });

  it('should throw if control is not a FormGroup', () => {
    expect(() => {
      component.config = { type: 'slider-range', name: 'range', label: 'My Range Slider' };
      // Passing a FormControl instead of FormGroup to cause error
      component.control = new FormControl(0) as any;
      fixture.detectChanges();
    }).toThrowError('The control must be a FormGroup for a slider range field');
  });

  it('should initialize start and end controls if not present', () => {
    const group = new FormGroup({});
    initWithConfig({}, group);
    expect(group.contains('start')).toBeTrue();
    expect(group.contains('end')).toBeTrue();
    expect(group.get('start')?.value as any).toBe(10);
    expect(group.get('end')?.value as any).toBe(90);    // from validators.max
  });

  it('should show icon and label', () => {
    initWithConfig();
    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.textContent).toContain('Select Range');

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('tune');
  });

  it('getFormControl should return correct FormControl', () => {
    const group = new FormGroup({
      start: new FormControl(20),
      end: new FormControl(80)
    });
    initWithConfig({}, group);
    const startControl = component.getFormControl('start');
    expect(startControl.value).toBe(20);
  });

  it('onInputChange should update value in form group', () => {
    const group = new FormGroup({
      start: new FormControl(0),
      end: new FormControl(100)
    });
    initWithConfig({}, group);
    component.onInputChange('start', '55');
    expect(group.get('start')?.value).toBe(55);
  });

});
