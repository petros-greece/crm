import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { FormFieldConfig } from '../../form-builder.model';

// 🔧 Create a concrete subclass just for testing
@Component({
  selector: 'app-test-field',
  template: '<div></div>',
})
class TestFieldComponent extends BaseFieldComponent<FormControl> {}

describe('BaseFieldComponent', () => {
  let component: TestFieldComponent;
  let fixture: ComponentFixture<TestFieldComponent>;

  const mockConfig: FormFieldConfig = {
    type: 'text',
    name: 'testField',
    label: 'Test Field'
  };

  const mockControl = new FormControl('');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFieldComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFieldComponent);
    component = fixture.componentInstance;
  });

  it('should throw error if config is not provided', () => {
    component.control = mockControl;
    expect(() => fixture.detectChanges()).toThrowError(
      'Field component requires config and control input'
    );
  });

  it('should throw error if control is not provided', () => {
    component.config = mockConfig;
    expect(() => fixture.detectChanges()).toThrowError(
      'Field component requires config and control input'
    );
  });

  it('should not throw if config and control are provided', () => {
    component.config = mockConfig;
    component.control = mockControl;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should retain the provided config and control values', () => {
    component.config = mockConfig;
    component.control = mockControl;
    fixture.detectChanges();

    expect(component.config).toBe(mockConfig);
    expect(component.control).toBe(mockControl);
  });
});
