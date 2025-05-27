import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectFieldComponent } from './select-field.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;

  const staticOptions = [
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        BrowserAnimationsModule, // Required for MatSelect
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render static options', async () => {
    component.config = {
      type: 'select',
      name: 'selectTest',
      label: 'Choose',
      options: staticOptions,
    };
    component.control = new FormControl();
    fixture.detectChanges();

    // Open the select dropdown
    const trigger = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    await fixture.whenStable(); // Wait for overlay to be rendered

    const options = document.querySelectorAll('mat-option');
    expect(options.length).toBe(2);
    expect(options[0].textContent).toContain('One');
    expect(options[1].textContent).toContain('Two');
  });


  it('should render dynamic options from observable', () => {
    const dynamic$ = of(staticOptions);

    component.config = {
      type: 'select',
      name: 'dynamicSelect',
      label: 'Dynamic',
      dynamicOptions: dynamic$,
    };
    component.control = new FormControl();
    fixture.detectChanges();

    component.options$.subscribe(options => {
      expect(options.length).toBe(2);
      expect(options[0].label).toBe('One');
    });
  });

  it('should disable control if config.disabled is true', () => {
    component.config = {
      type: 'select',
      name: 'disabledField',
      label: 'Disabled',
      options: staticOptions,
      disabled: true,
    };
    component.control = new FormControl();
    fixture.detectChanges();

    expect(component.control.disabled).toBeTrue();
  });

  it('should disable control if options array is empty', () => {
    component.config = {
      type: 'select',
      name: 'noOptions',
      label: 'No Options',
      options: [],
    };
    component.control = new FormControl();
    fixture.detectChanges();

    expect(component.control.disabled).toBeTrue();
  });

  it('should clean up subscription on destroy', () => {
    const dynamic$ = new BehaviorSubject(staticOptions);

    component.config = {
      type: 'select',
      name: 'withDestroy',
      label: 'Destroy Me',
      dynamicOptions: dynamic$,
    };
    component.control = new FormControl();
    fixture.detectChanges();

    spyOn(component['optionsSub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['optionsSub'].unsubscribe).toHaveBeenCalled();
  });

  it('should show required error when control is invalid', () => {
    component.config = {
      type: 'select',
      name: 'requiredField',
      label: 'Required',
      options: staticOptions,
    };
    component.control = new FormControl('', { validators: c => c.value ? null : { required: true } });
    fixture.detectChanges();

    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl.nativeElement.textContent).toContain('Required is required');
  });

  it('should track option by value', () => {
    const option = { label: 'Test', value: 42 };
    expect(component.trackByValue(0, option)).toBe(42);
  });
});
