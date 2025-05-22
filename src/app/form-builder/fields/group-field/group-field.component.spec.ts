import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupFieldComponent } from './group-field.component';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { FormFieldConfig } from '../../form-builder.model';

describe('GroupFieldComponent', () => {
  let component: GroupFieldComponent;
  let fixture: ComponentFixture<GroupFieldComponent>;

  const configMock: FormFieldConfig = {
    name: 'group1',
    type: 'group',
    label: 'Test Group',
    fields: [
      { type: 'text', name: 'firstName', label: 'First Name', columns: 1 },
      { type: 'select', name: 'country', label: 'Country', columns: 2 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, GroupFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormGroup({
      firstName: new FormControl(''),
      country: new FormControl('')
    });
    component.config = configMock;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render fields based on config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-input-field').length).toBe(1);
    expect(compiled.querySelectorAll('app-select-field').length).toBe(1);
  });

  it('should patch form value with writeValue()', () => {
    component.writeValue({ firstName: 'John', country: 'US' });
    expect(component.control.get('firstName')?.value).toBe('John');
    expect(component.control.get('country')?.value).toBe('US');
  });

  it('should register value change function', (done) => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.control.get('firstName')?.setValue('Alice');
    fixture.detectChanges();
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should enable and disable the form group', () => {
    component.setDisabledState(true);
    expect(component.control.disabled).toBeTrue();

    component.setDisabledState(false);
    expect(component.control.enabled).toBeTrue();
  });

  it('should calculate grid columns correctly', () => {
    expect(component.gridColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('should return correct FormControl', () => {
    const ctrl = component.getFormControl('firstName');
    expect(ctrl).toBeInstanceOf(FormControl);
  });

  it('should throw if non-FormControl is accessed', () => {
    component.control = new FormGroup({
      nested: new FormGroup({})
    });
    expect(() => component.getFormControl('nested')).toThrowError(/Expected FormControl/);
  });
});
