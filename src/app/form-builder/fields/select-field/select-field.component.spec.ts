import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SelectFieldComponent } from './select-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;

    component.control = new FormControl('');
    component.config = {
      type: 'select',
      name: 'testSelect',
      label: 'Test Select',
      icon: 'menu',
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
      ],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and icon', () => {
    const labelEl = fixture.debugElement.query(By.css('mat-label'));
    expect(labelEl.nativeElement.textContent).toContain('Test Select');
    const iconEl = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconEl.nativeElement.textContent).toContain('menu');
  });

  it('should initialize options$ with static options', fakeAsync(() => {
    component.ngOnInit();
    let options: any;
    component.options$.subscribe(opts => options = opts);
    tick();
    expect(options.length).toBe(2);
    expect(options[0].label).toBe('One');
  }));

  it('should disable control if config.disabled is true', fakeAsync(() => {
    component.config.disabled = true;
    component.ngOnInit();
    tick();
    expect(component.control.disabled).toBeTrue();
  }));

  it('should disable control if options array is empty', fakeAsync(() => {
    component.config.options = [];
    component.ngOnInit();
    tick();
    expect(component.control.disabled).toBeTrue();
  }));

  it('should enable control if options are present and config.disabled is false', fakeAsync(() => {
    component.control.disable();
    component.config.disabled = false;
    component.config.options = [{ label: 'X', value: 'x' }];
    component.ngOnInit();
    tick();
    expect(component.control.enabled).toBeTrue();
  }));

  it('should subscribe to dynamicOptions as Observable', fakeAsync(() => {
    const subject = new Subject<any>();
    component.config.dynamicOptions = subject.asObservable();
    component.ngOnInit();
    let emittedOptions: any;
    component.options$.subscribe(opts => emittedOptions = opts);
    tick();

    expect(emittedOptions).toBeUndefined(); // no emit yet
    subject.next([{ label: 'A', value: 'a' }]);
    tick();
    expect(emittedOptions.length).toBe(1);
    expect(emittedOptions[0].label).toBe('A');
  }));

  it('should subscribe to dynamicOptions as function returning Promise', fakeAsync(() => {
    component.config.dynamicOptions = () => Promise.resolve([{ label: 'P', value: 'p' }]);
    component.ngOnInit();

    let options: any;
    component.options$.subscribe(opts => options = opts);
    tick();
    expect(options.length).toBe(1);
    expect(options[0].label).toBe('P');
  }));

  // it('should clean up subscription on destroy', () => {
  //   component.ngOnInit();
  //   spyOn(component.optionsSub, 'unsubscribe');
  //   component.ngOnDestroy();
  //   expect(component.optionsSub.unsubscribe).toHaveBeenCalled();
  // });

  it('should track options by their value', () => {
    const opt = { label: 'Lbl', value: 42 };
    expect(component.trackByValue(0, opt)).toBe(42);
  });

  it('should display options in mat-select', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(options.length).toBe(2);
    expect(options[0].nativeElement.textContent.trim()).toBe('One');
    expect(options[1].nativeElement.textContent.trim()).toBe('Two');
  }));

  it('should show error message when control is invalid and touched', () => {
    component.control.setErrors({ required: true });
    component.control.markAsTouched();
    component.control.markAsDirty();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Test Select is required');
  });

  it('should support multiple select when config.multiple=true', () => {
    component.config.multiple = true;
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(By.css('mat-select'));
    expect(selectEl.attributes['ng-reflect-multiple']).toBe('true');
  });
});
