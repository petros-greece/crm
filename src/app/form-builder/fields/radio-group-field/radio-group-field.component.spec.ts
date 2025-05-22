import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RadioGroupFieldComponent } from './radio-group-field.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('RadioGroupFieldComponent', () => {
  let component: RadioGroupFieldComponent;
  let fixture: ComponentFixture<RadioGroupFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RadioGroupFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupFieldComponent);
    component = fixture.componentInstance;
  });

  function initComponent(config: any = {}, control?: FormControl) {
    component.config = {
      type: 'radio',   // <-- required
      name: 'testRadio',     // <-- required
      label: 'Test Label',
      icon: 'check',
      required: true,
      options: [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 }
      ],
      ...config
    };

    component.control = control || new FormControl();
    fixture.detectChanges();
  }

  it('should create', () => {
    initComponent();
    expect(component).toBeTruthy();
  });

  it('should set availableOptions from config.options', () => {
    initComponent();
    expect(component.availableOptions.length).toBe(2);
    expect(component.availableOptions[0].label).toBe('Option 1');
  });

  it('should subscribe to dynamicOptions Observable', () => {
    const obs = of([
      { label: 'Obs Option 1', value: 'a' },
      { label: 'Obs Option 2', value: 'b' }
    ]);
    component.config = {
      type: 'radio',
      name: 'testRadio',
      label: 'Dynamic Obs',
      dynamicOptions: obs
    };
    component.control = new FormControl();
    fixture.detectChanges();

    expect(component.availableOptions.length).toBe(2);
    expect(component.availableOptions[0].label).toBe('Obs Option 1');
  });

  it('should load dynamicOptions from Promise function', fakeAsync(() => {
    const promiseFn = jasmine.createSpy('promiseFn').and.returnValue(Promise.resolve([
      { label: 'Promise Option 1', value: 'x' },
      { label: 'Promise Option 2', value: 'y' }
    ]));

    component.config = {
      type: 'radio',   // <-- required
      name: 'testRadio',     // <-- required
      label: 'Dynamic Promise',
      dynamicOptions: promiseFn
    };
    component.control = new FormControl();
    fixture.detectChanges();

    tick(); // simulate async

    expect(promiseFn).toHaveBeenCalled();
    expect(component.availableOptions.length).toBe(2);
    expect(component.availableOptions[0].label).toBe('Promise Option 1');
  }));

  it('should render label, icon, and required asterisk', () => {
    initComponent();
    const labelEl = fixture.debugElement.query(By.css('mat-label')).nativeElement;
    const iconEl = fixture.debugElement.query(By.css('mat-icon')).nativeElement;
    expect(labelEl.textContent).toContain('Test Label');
    expect(iconEl.textContent.trim()).toBe('check');
    expect(labelEl.textContent).toContain('*');
  });

  it('should render radio buttons for options', () => {
    initComponent();
    const radios = fixture.debugElement.queryAll(By.css('mat-radio-button'));
    expect(radios.length).toBe(2);
    expect(radios[0].nativeElement.textContent).toContain('Option 1');
  });

  it('should mark control as touched on change', () => {
    initComponent();
    spyOn(component.control, 'markAsTouched');
    component.markAsTouched();
    expect(component.control.markAsTouched).toHaveBeenCalled();
  });

  it('should not mark as touched if already touched', () => {
    initComponent();
    component.control.markAsTouched();
    spyOn(component.control, 'markAsTouched');
    component.markAsTouched();
    expect(component.control.markAsTouched).not.toHaveBeenCalled();
  });

  it('should display required error message when invalid and touched', () => {
    initComponent({ required: true }, new FormControl('', { nonNullable: true, validators: [control => control.value ? null : { required: true }] }));
    component.control.markAsTouched();
    component.control.setErrors({ required: true });
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('mat-error span'));
    expect(errorEl.nativeElement.textContent).toContain('Test Label is required');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const obs = of([{ label: 'Option', value: 1 }]);
    component.config = {
      type: 'radio',
      name: 'testRadio',
      label: 'Test Radio',
      dynamicOptions: obs
    };
    component.control = new FormControl();
    fixture.detectChanges();

    spyOn(component['subscription']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscription']!.unsubscribe).toHaveBeenCalled();
  });
});
