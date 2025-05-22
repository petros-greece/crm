import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutocompleteFieldComponent } from './autocomplete-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AutocompleteFieldComponent', () => {
  let component: AutocompleteFieldComponent;
  let fixture: ComponentFixture<AutocompleteFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteFieldComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteFieldComponent);
    component = fixture.componentInstance;

    component.config = {
      type: 'autocomplete',
      name: 'test',
      label: 'Test Label',
      options: [
        { label: 'Option1', value: 'opt1' },
        { label: 'Option2', value: 'opt2' }
      ]
    };
    component.control = new FormControl('');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with static options', () => {
    fixture.detectChanges();
    expect(component.filteredOptions.length).toBe(2);
  });

  it('should update options with dynamic Observable', fakeAsync(() => {
    const dynamic$ = of([{ label: 'Dynamic1', value: 'dyn1' }]);
    component.config.dynamicOptions = dynamic$;
    fixture.detectChanges();
    tick();
    expect(component.filteredOptions.some(o => o.label === 'Dynamic1')).toBeTrue();
  }));

  it('should update options with dynamic Promise', fakeAsync(() => {
    component.config.dynamicOptions = () => Promise.resolve([{ label: 'DynPromise', value: 'dynp' }]);
    fixture.detectChanges();
    tick();
    expect(component.filteredOptions.some(o => o.label === 'DynPromise')).toBeTrue();
  }));

  it('should setup filtering on control value changes', fakeAsync(() => {
    fixture.detectChanges();
    component.control.setValue('Opt');
    tick(300); // debounce
    expect(component.filteredOptions.length).toBe(2);

    component.control.setValue('Option1');
    tick(300);
    expect(component.filteredOptions.length).toBe(1);
    expect(component.filteredOptions[0].label).toBe('Option1');
  }));

  it('should setup displayLabel for initial value', () => {
    component.control.setValue('opt1');
    fixture.detectChanges();
    expect(component.displayLabel).toBe('Option1');
  });

  it('should update displayLabel on control value changes', () => {
    fixture.detectChanges();
    component.control.setValue('opt1');
    expect(component.displayLabel).toBe('Option1');
    component.control.setValue('opt2');
    expect(component.displayLabel).toBe('Option2');
    component.control.setValue('unknown');
    expect(component.displayLabel).toBe('');
  });

  it('should return correct label from displayFn', () => {
    fixture.detectChanges();
    let label = component.displayFn('opt1');
    expect(label).toBe('Option1');

    label = component.displayFn('nonexistent');
    expect(label).toBe('nonexistent');

    label = component.displayFn(null);
    expect(label).toBe('');
  });

  it('should display error message when control is invalid and touched or dirty', () => {
    component.control.setValidators([control => control.value ? null : { required: true }]);
    component.control.updateValueAndValidity();

    fixture.detectChanges();
    let errorElem = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElem).toBeNull();

    component.control.markAsTouched();
    component.control.setValue('');
    fixture.detectChanges();
    errorElem = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElem).toBeTruthy();
    expect(errorElem.nativeElement.textContent).toContain('Test Label is required');
  });

  it('should update displayLabel on ngOnChanges', () => {
    fixture.detectChanges();
    component.control.setValue('opt1');
    component.ngOnChanges();
    expect(component.displayLabel).toBe('Option1');

    component.control.setValue('unknown');
    component.ngOnChanges();
    expect(component.displayLabel).toBe('');
  });
});
